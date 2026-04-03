# gstack DeepSeek Setup Guide

This guide turns the DeepSeek integration into a repeatable setup flow you can use again in this repo or another project.

## What This Solves

Use DeepSeek for the highest-token thinking workflows so you can:

- spend fewer Codex tokens
- keep gstack usable in token-constrained projects
- offload product critique, architecture critique, and review-heavy work to DeepSeek

DeepSeek does **not** replace the host agent completely. It works best for analysis-heavy skills, not runtime-heavy orchestration.

## What Is Supported

These DeepSeek-first skills are available:

- `/gstack-deepseek`
- `/gstack-deepseek-review`
- `/gstack-deepseek-office-hours`
- `/gstack-deepseek-plan-eng-review`
- `/gstack-deepseek-plan-ceo-review`

These are the best candidates for DeepSeek because they are mostly thinking, reviewing, and critiquing.

## What Is Not a Full Replacement

Do not assume DeepSeek can fully replace these:

- `/qa`
- `/browse`
- `/ship`
- `/land-and-deploy`

Those depend heavily on the host agent's local tools, browser control, and orchestration.

## One-Time Setup

### 1. Make sure Bun is on PATH

Add this to `~/.bashrc` if needed:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

Reload:

```bash
source ~/.bashrc
```

Verify:

```bash
command -v bun
```

Expected:

```bash
/Users/you/.bun/bin/bun
```

### 2. Add DeepSeek environment variables

Put this in `~/.bashrc`:

```bash
export DEEPSEEK_API_KEY="your-key"
export DEEPSEEK_BASE_URL="https://api.deepseek.com"
export DEEPSEEK_MODEL="deepseek-reasoner"
```

Reload:

```bash
source ~/.bashrc
```

Verify:

```bash
bash -lc 'source ~/.bashrc; [ -n "$DEEPSEEK_API_KEY" ] && echo DEEPSEEK_API_KEY_SET; echo "$DEEPSEEK_BASE_URL"; echo "$DEEPSEEK_MODEL"'
```

Expected:

```bash
DEEPSEEK_API_KEY_SET
https://api.deepseek.com
deepseek-reasoner
```

## One-Command Refresh

From the gstack repo root:

```bash
source ~/.bashrc
cd /Users/ceo/gstack
./setup --host codex
```

This is the preferred command because it:

- regenerates skill docs
- refreshes `.agents/skills/`
- keeps the Codex-facing skill install up to date

## Direct Regeneration Command

If you only want to rebuild skill docs:

```bash
source ~/.bashrc
cd /Users/ceo/gstack
/Users/ceo/.bun/bin/bun run scripts/gen-skill-docs.ts
/Users/ceo/.bun/bin/bun run scripts/gen-skill-docs.ts --host codex
```

## Verify DeepSeek Skills Exist

Run:

```bash
ls .agents/skills | grep '^gstack-deepseek'
```

Expected output:

```bash
gstack-deepseek
gstack-deepseek-office-hours
gstack-deepseek-plan-ceo-review
gstack-deepseek-plan-eng-review
gstack-deepseek-review
```

If you want to inspect the generated files:

```bash
find .agents/skills -maxdepth 2 -path '*/gstack-deepseek*/*' -name 'SKILL.md' | sort
```

## Verify DeepSeek API Works

### Minimal API smoke test

```bash
bash -lc 'source ~/.bashrc; curl -sS https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  --data "{\"model\":\"deepseek-chat\",\"messages\":[{\"role\":\"user\",\"content\":\"reply with just ok\"}],\"stream\":false}"'
```

Success signal:

- response contains `choices`

Failure signals:

- `401` or auth message: bad key
- `429`: quota/rate limit
- timeout: network or service issue

## Verify the Skill Is Using DeepSeek API

Open:

- `deepseek/SKILL.md`

You should see:

- `DEEPSEEK_API_KEY`
- `https://api.deepseek.com`
- `deepseek-reasoner`
- `deepseek-chat`

That confirms the skill is API-based, not local-binary-based.

## Recommended Usage Order

If you want to minimize Codex token burn, prefer this sequence:

1. `/gstack-deepseek-office-hours`
2. `/gstack-deepseek-plan-ceo-review`
3. `/gstack-deepseek-plan-eng-review`
4. `/gstack-deepseek-review`

Use `/gstack-deepseek` when you want a general-purpose DeepSeek consult or challenge outside the structured workflows.

## Command Cheat Sheet

### General DeepSeek

```text
/gstack-deepseek review
/gstack-deepseek review focus on security
/gstack-deepseek challenge
/gstack-deepseek should we split this service by tenant?
```

### Product / idea shaping

```text
/gstack-deepseek-office-hours
```

### CEO / scope critique

```text
/gstack-deepseek-plan-ceo-review
```

### Architecture / tests critique

```text
/gstack-deepseek-plan-eng-review
```

### Diff review

```text
/gstack-deepseek-review
```

## Troubleshooting Checklist

### Problem: Codex only shows `gstack-deepseek`

Likely causes:

1. `.agents/skills/` was not regenerated
2. Codex is still using a cached skill list

Fix:

```bash
source ~/.bashrc
cd /Users/ceo/gstack
./setup --host codex
```

Then:

- reopen the project in Codex
- or start a fresh Codex session

### Problem: `bun: command not found`

Fix:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
source ~/.bashrc
command -v bun
```

### Problem: DeepSeek command exists but API call fails

Check:

```bash
bash -lc 'source ~/.bashrc; echo "${DEEPSEEK_BASE_URL:-missing}"; [ -n "$DEEPSEEK_API_KEY" ] && echo key-present || echo key-missing'
```

If key is missing, re-add env vars to `~/.bashrc`.

### Problem: DeepSeek returns auth error

Likely:

- invalid API key
- expired/revoked key
- typo in key

Fix:

1. rotate or re-copy the key from DeepSeek
2. update `~/.bashrc`
3. run `source ~/.bashrc`
4. rerun the smoke test

### Problem: DeepSeek returns rate limit or quota issue

Likely:

- depleted balance
- per-minute rate limit

Fix:

- check DeepSeek billing/quota
- retry with smaller prompt or after a short wait

### Problem: Skills exist in the repo but not in Codex

Check repo output:

```bash
ls .agents/skills | grep '^gstack-deepseek'
```

If present in repo but not in Codex UI:

- restart Codex session
- reopen the project

### Problem: Review/plan skill feels too shallow

Use the more specialized DeepSeek-prefixed workflow instead of the generic one:

- prefer `/gstack-deepseek-review` over `/gstack-deepseek`
- prefer `/gstack-deepseek-plan-eng-review` over `/gstack-deepseek`
- prefer `/gstack-deepseek-plan-ceo-review` over `/gstack-deepseek`

## Security Notes

- `DEEPSEEK_API_KEY` lives in your shell config, so protect `~/.bashrc`
- if the key was ever pasted into chat, assume it may need rotation
- after rotating a key, update `~/.bashrc` and rerun `source ~/.bashrc`

## Full Re-Setup Recipe

If you ever want to redo everything from scratch in this repo:

```bash
source ~/.bashrc
cd /Users/ceo/gstack
./setup --host codex
ls .agents/skills | grep '^gstack-deepseek'
bash -lc 'source ~/.bashrc; curl -sS https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  --data "{\"model\":\"deepseek-chat\",\"messages\":[{\"role\":\"user\",\"content\":\"reply with just ok\"}],\"stream\":false}"'
```

If all three parts succeed:

1. setup succeeded
2. DeepSeek skills were generated
3. DeepSeek API is reachable and authenticated

## Files Involved

- `deepseek/SKILL.md`
- `deepseek/SKILL.md.tmpl`
- `gstack-deepseek-review/SKILL.md.tmpl`
- `gstack-deepseek-office-hours/SKILL.md.tmpl`
- `gstack-deepseek-plan-eng-review/SKILL.md.tmpl`
- `gstack-deepseek-plan-ceo-review/SKILL.md.tmpl`
- `README.md`
- `AGENTS.md`
- `docs/skills.md`
- `test/deepseek-e2e.test.ts`

## Best Mental Model

Use DeepSeek for:

- heavy thinking
- review passes
- product critique
- architecture critique

Use Codex sparingly for:

- orchestration
- local tool execution
- editing flows
- runtime-heavy skills

That split gives you the best cost/control balance.
