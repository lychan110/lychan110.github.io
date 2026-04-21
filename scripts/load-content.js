'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

const CONTENT_DIR = path.resolve(__dirname, '../content');

function loadCv() {
    const file = path.join(CONTENT_DIR, 'cv.yml');
    if (!fs.existsSync(file)) return {};
    return yaml.load(fs.readFileSync(file, 'utf8')) || {};
}

function loadProjects() {
    const dir = path.join(CONTENT_DIR, 'projects');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(f => {
            const parsed = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
            return { ...parsed.data, body: parsed.content.trim(), slug: f.replace(/\.md$/, '') };
        })
        .filter(p => p.status !== 'draft')
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

module.exports = function loadContent() {
    return {
        cv: loadCv(),
        projects: loadProjects()
    };
};
