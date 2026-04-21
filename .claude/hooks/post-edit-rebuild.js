#!/usr/bin/env node
'use strict';
// PostToolUse hook: rebuild Pug when content/ or src/pug/ files change.
// Silent no-op otherwise.

const { execSync } = require('child_process');
const path = require('path');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    let payload;
    try { payload = JSON.parse(input); } catch { process.exit(0); }
    const filePath = payload?.tool_input?.file_path || '';
    if (!filePath) process.exit(0);

    const norm = filePath.replace(/\\/g, '/');
    const triggers = ['/content/', '/src/pug/', '/src/assets/ychan_pubs.bib'];
    if (!triggers.some(t => norm.includes(t))) process.exit(0);

    const repoRoot = path.resolve(__dirname, '../..');
    try {
        execSync('npm run build:pug', { cwd: repoRoot, stdio: 'inherit' });
    } catch (err) {
        console.error('### build:pug failed:', err.message);
        process.exit(1);
    }
});
