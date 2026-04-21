---
name: sync-from-obsidian
description: Pull a project or CV entry from an Obsidian vault note (personal or work) into this site's content/ directory, scrubbing IP/secrets for work-vault sources. Use when the user references an Obsidian note by path, title, or says "sync from my vault", "import this note", or similar.
disable-model-invocation: true
---

# sync-from-obsidian

Copy a note from `~/Obsidian/personal` ("Lenya's brain") or `~/Obsidian/work` (IP-bearing) into the site's `content/` schema.

**User-invocable only.** Side effects on real files — don't trigger automatically.

## Inputs to gather

1. **Vault**: `personal` or `work`. Default to personal if the user doesn't say — but confirm before proceeding if the note content looks like work.
2. **Source note path** (absolute) or enough info to find it via the filesystem MCP.
3. **Target type**: project (most common), experience, talk, award. If unclear, ask.

## Workflow

### 1. Read the source note
Use Read or the filesystem MCP. Parse frontmatter + body.

### 2. IF vault is `work` → scrub first
**Mandatory.** Invoke the `ip-scrubber` subagent with the raw note content. Proceed only if it returns PASS. If it returns findings, show them to the user and wait for direction — do not attempt to "fix and retry" silently.

### 3. Map Obsidian frontmatter → site frontmatter

Obsidian notes typically have rich metadata. Pick only what the site schema defines (see `/add-entry` skill). Typical mapping:

| Obsidian field | Site field | Notes |
|---|---|---|
| `title` / H1 | `title` | |
| `date` / `created` | used for `order` | higher = newer; recent entries get higher `order` |
| `tags` | `tags` | drop any internal/client tags |
| cover image link | `image` | copy the image file into `src/assets/img/` and rewrite the path |
| body | body | strip Obsidian-isms: `[[wikilinks]]`, `#tag` inlines, `^block-refs`, Dataview blocks, frontmatter comments |
| — | `source_vault` | set to `personal` or `work` per source |
| — | `status` | `draft` if any content still needs review; `published` once clean |

### 4. Rewrite prose
Obsidian notes are often informal/long. The site needs 1–3 sentences per project. Condense without editorializing. Preserve technical substance; drop meta-commentary ("TODO: rewrite this section", "ask advisor about X").

### 5. Write to `content/` and rebuild
Follow `/add-entry` from step 5 onward.

### 6. Confirm with user
Show: source path, target path, status (draft/published), any scrubber findings that were accepted/redacted.

## Scrub checklist (applied automatically for work vault; review manually even for personal)

The `ip-scrubber` subagent handles the heavy lifting. But as a sanity check before writing, confirm the proposed output does NOT contain:

- Client names, project codenames, internal product names
- Internal URLs (`*.internal`, `*.corp`, JIRA/Confluence/GitLab links)
- Absolute file paths from a work machine
- Employee names other than the user
- Numeric values that could be revenue, headcount, or unpublished specs
- Unredacted screenshots or figures (check image filenames for hints)
- "Patent pending", NDA-protected details, or unreleased product references

If anything on this list survives into the output, abort and flag it to the user.

## Guardrails

- Never write directly from work vault to `content/` without scrubber approval.
- Never commit in this skill — leave that to the user.
- One note per invocation. Batch syncs hide mistakes.
