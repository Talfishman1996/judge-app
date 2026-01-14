# Handoff: Cloudflare Pages Migration

**Date:** 2026-01-13
**Session:** Cloudflare Pages API Proxy Implementation

---

## What Was Done

### Cloudflare Pages Function Created
- **File:** `functions/api/analyze.ts`
- Proxies requests to Gemini API with anti-sycophancy prompt
- Handles both text and screenshot evidence
- Model: `gemini-2.0-flash-exp`
- Includes CORS headers for browser requests

### Files Modified/Created
| File | Change |
|------|--------|
| `functions/api/analyze.ts` | NEW - Cloudflare Pages Function |
| `functions/tsconfig.json` | NEW - TypeScript config |
| `app/vite.config.ts` | MODIFIED - Removed `/judge-app/` base path, added proxy |
| `wrangler.toml` | NEW - Cloudflare config |
| `.dev.vars` | NEW - Local dev env vars |
| `.gitignore` | MODIFIED - Added .dev.vars |
| `app/api/` | DELETED - Old Vercel API |
| `app/vercel.json` | DELETED - Vercel config |

### Known Issue: wrangler pages dev env vars
There's a bug in `wrangler pages dev` where environment variables from `.dev.vars` don't reach the function (they show in startup but `env` only contains `ASSETS`).

**Workaround:** Added `LOCAL_DEV_KEY` constant in the function for local testing.

---

## What Needs to Be Done

### 1. Deploy to Cloudflare Pages (Manual Steps)
1. Go to https://dash.cloudflare.com/pages
2. Create new project → Connect to GitHub → Select repo
3. Build settings:
   - Command: `cd app && npm install && npm run build`
   - Output: `app/dist`
4. Environment variables:
   - `GEMINI_API_KEY` = `AIzaSyAAFMVltRc4lu1uAfCcNG1ZLtefWC5noQU`

### 2. Security: Remove LOCAL_DEV_KEY Before Public
- **File:** `functions/api/analyze.ts` line 69
- Remove the hardcoded key before making repo public
- In production, `env.GEMINI_API_KEY` from Cloudflare dashboard is used

### 3. Remaining Tier 1 Blockers (from CONTINUITY_LEDGER.md)
- Fix remaining ESLint errors
- Add basic accessibility (ARIA labels, focus states)
- Add vercel.json equivalent for SPA routing on Cloudflare

---

## Local Testing Commands

```bash
cd "C:/Users/Admin/Desktop/Projects/Judge App"

# Build frontend
cd app && npm run build && cd ..

# Run local server with functions
npx wrangler pages dev app/dist --port 8788

# Test API
curl -X POST http://localhost:8788/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"evidence": {"type": "text", "conversation": "test", "partyA": "A", "partyB": "B"}}'
```

---

## Key Files Reference

| What | Path |
|------|------|
| API Function | `functions/api/analyze.ts` |
| Cloudflare Config | `wrangler.toml` |
| Local Env Vars | `.dev.vars` |
| Frontend Build | `app/dist/` |
| Project Status | `.claude/CONTINUITY_LEDGER.md` |
