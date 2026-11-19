#!/usr/bin/env node
'use strict';
// PreToolUse hook for Write/Edit: block if content matches any IP keyword.
// Keywords are one-per-line in .claude/ip-keywords.txt (gitignored).
// Exit 2 + stderr message = block tool call and surface reason to Claude.
// Missing keyword file or empty file = silent pass.

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    let payload;
    try { payload = JSON.parse(input); } catch { process.exit(0); }

    const keywordFile = path.resolve(__dirname, '../ip-keywords.txt');
    if (!fs.existsSync(keywordFile)) process.exit(0);

    const keywords = fs.readFileSync(keywordFile, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));
    if (keywords.length === 0) process.exit(0);

    const ti = payload?.tool_input || {};
    const parts = [ti.content, ti.new_string, ti.old_string]
        .concat((ti.edits || []).flatMap(e => [e.new_string, e.old_string]))
        .filter(Boolean);
    const haystack = parts.join('\n').toLowerCase();
    if (!haystack) process.exit(0);

    const hits = keywords.filter(k => haystack.includes(k.toLowerCase()));
    if (hits.length === 0) process.exit(0);

    console.error(
        `Blocked: content contains IP keyword(s): ${hits.join(', ')}.\n` +
        `Remove the keyword(s) or run the ip-scrubber subagent. ` +
        `Keyword list: .claude/ip-keywords.txt`
    );
    process.exit(2);
});
