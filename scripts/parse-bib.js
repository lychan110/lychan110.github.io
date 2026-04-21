/**
 * scripts/parse-bib.js
 * Parses src/assets/ychan_pubs.bib -> public/data/publications.json
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIB_PATH  = path.resolve(__dirname, '../src/assets/ychan_pubs.bib');
const OUT_DIR   = path.resolve(__dirname, '../public/data');
const OUT_PATH  = path.join(OUT_DIR, 'publications.json');

function parseBib(src) {
    const entries = [];
    const entryRe = /@(\w+)\s*\{\s*([^,]+),([^@]*?)(?=@|\s*$)/gs;
    let m = entryRe.exec(src);
    while (m !== null) {
        const type  = m[1].toLowerCase();
        const key   = m[2].trim();
        const body  = m[3];
        const fields = {};
        const fieldRe = /(\w+)\s*=\s*(?:\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}|"([^"]*)"|(\d+))/g;
        let fm = fieldRe.exec(body);
        while (fm !== null) {
            const name = fm[1].toLowerCase();
            const val  = (fm[2] ?? fm[3] ?? fm[4] ?? '').trim();
            fields[name] = val;
            fm = fieldRe.exec(body);
        }
        entries.push({ type, key, ...fields });
        m = entryRe.exec(src);
    }
    return entries;
}

function cleanLatex(str) {
    if (str == null || str === '') return '';
    return str
        .replace(/\\textquotedblleft/g,  '“')
        .replace(/\\textquotedblright/g, '”')
        .replace(/\\textquoteleft/g,     '‘')
        .replace(/\\textquoteright/g,    '’')
        .replace(/\\&/g,                 '&')
        .replace(/\\-/g,                 '-')
        .replace(/[{}]/g,                '');
}

function formatAuthors(authorStr) {
    if (authorStr == null || authorStr === '') return '';
    return authorStr
        .split(/\s+and\s+/i)
        .map(a => {
            const parts = a.trim().split(',');
            if (parts.length >= 2) {
                const last  = parts[0].trim();
                const first = parts[1].trim().split(' ')[0];
                return last + ' ' + first.charAt(0);
            }
            return a.trim();
        })
        .join(', ');
}

fs.mkdirSync(OUT_DIR, { recursive: true });

if (fs.existsSync(BIB_PATH)) {
    const src = fs.readFileSync(BIB_PATH, 'utf8');
    const raw = parseBib(src);

    const pubs = raw
        .map(e => ({
            key:     e.key,
            type:    e.type,
            title:   cleanLatex(e.title),
            authors: formatAuthors(e.author),
            year:    e.year || '',
            venue:   cleanLatex(e.journal || e.booktitle || ''),
            doi:     e.doi || '',
            url:     e.url || '',
        }))
        .filter(e => e.title)
        .sort((a, b) => Number(b.year) - Number(a.year));

    fs.writeFileSync(OUT_PATH, JSON.stringify(pubs, null, 2));
    console.log('[parse-bib] Wrote ' + pubs.length + ' publications -> ' + OUT_PATH);
} else {
    console.warn('[parse-bib] Skipping: ' + BIB_PATH + ' not found.');
    process.exit(0);
}
