# JUDGE App - Design Decisions

This document explains WHY we made certain choices. Read this to understand the reasoning.

---

## Tech Stack Decisions

### Why React + Vite (not Next.js, not plain HTML)
- **Vite** = Fastest dev server, instant hot reload, great for iteration
- **React** = Component-based, easy to build complex UIs like verdict screens
- **Not Next.js** = Don't need server-side rendering, this is a client-side app
- **Not plain HTML** = Too complex for state management (case history, form data)

### Why TypeScript
- Catches errors before runtime
- Better autocomplete when building components
- Gemini API responses need type safety

### Why TailwindCSS (not regular CSS)
- Faster to iterate on designs
- Custom color palette is easy (`judge-gold`, `judge-red`, etc.)
- Responsive design built-in
- No CSS file management headaches

### Why IndexedDB (not localStorage, not a backend)
- **IndexedDB** = Can store large data (screenshots, full verdicts)
- **Not localStorage** = 5MB limit, can't store images
- **Not a backend** = Keeps it simple, no server to manage, works offline

### Why Gemini API (not Claude API, not OpenAI)
- User requested Gemini
- Good vision capabilities for screenshot OCR
- Cost-effective for this use case
- **Model: gemini-3-pro-preview** (Gemini 3 Pro - latest, released Nov 2025)
  - 1M token context window
  - Advanced reasoning capabilities
  - Best for complex verdict analysis
- API key stored in app/.env (VITE_GEMINI_API_KEY)

---

## UI/UX Decisions

### Why Pure Black Background (#000000)
- User specified "dark courtroom theme"
- Maximum contrast with white text
- Feels dramatic and authoritative
- "Law & Order meets Nuremberg" aesthetic per user request

### Why Gold (#D4A843) for Winners/Headers
- Gold = prestige, victory, importance
- Common in legal/court imagery
- High contrast on black background
- User specified this exact color

### Why Red (#FF3B3B) for Toxicity/Warnings
- Universal "danger" color
- Stands out for negative metrics
- User specified this exact color

### Why Purple (#8B5CF6) as Secondary
- Complements gold without competing
- Used for less critical accents
- User specified this exact color

### Why Uppercase Headers with Wide Letter-Spacing
- Feels authoritative and legal
- Mimics court documents and legal briefs
- "ALL RISE" needs to feel commanding

### Why No Emojis in the App
- Maintains serious courtroom aesthetic
- Legal documents don't have emojis
- User wants "clinical and precise" tone

---

## Feature Decisions

### Why Screenshots as "Exhibits A-J" (max 10)
- Mimics real court evidence labeling
- 10 is enough for most arguments
- More than 10 would overwhelm the AI analysis

### Why Shareable Verdict Cards
- Viral potential (share on social media)
- Main hook for user acquisition
- Multiple themes for personalization

### Why Local Storage (IndexedDB) for Case History
- Privacy - user's arguments stay on their device
- No backend costs
- Works offline
- User can delete anytime

### Why Gen-Z Terminology in Red Flags
- Target audience is younger users
- "Main character syndrome" more relatable than "narcissistic tendencies"
- Makes it shareable/memeable
- But "not overly cringey" per user request

---

## Technical Decisions

### Why Puppeteer for Screenshots (not Playwright)
- Already had it working
- Simpler setup on Windows
- Good enough for our needs

### Why Visual Iteration Workflow
- Claude can see what it built
- Catches UI bugs that tests miss
- Matches design spec visually, not just functionally

### Why PRD.json Approach
- One feature at a time prevents scope creep
- Clear success criteria
- Progress survives across sessions
- Autonomous loop knows when to stop

### Why Fail-Safe Stuck Detection
- Prevents infinite loops
- 3 tries max on same error
- Outputs BLOCKED: [reason] for human intervention
- Documented in LOOP-INSTRUCTIONS.md

---

## What We Explicitly Did NOT Do

### No Backend/Database Server
- Keeps deployment simple
- No ongoing costs
- All data stays local

### No User Accounts/Auth
- Privacy-first approach
- No data collection
- Simpler to build

### No Mobile App (React Native/Flutter)
- Web app works on mobile browsers
- Faster to build and iterate
- Can always wrap in Capacitor/PWA later

### No Monetization Features (Yet)
- Focus on core functionality first
- Can add premium themes later
- Can add "Pro" verdicts later

---

## User Preferences (from conversation)

1. **Action over asking** - Just do things, don't ask for permission
2. **Natural language** - User speaks normally, Claude figures it out
3. **Human-readable folders** - No cryptic names, clear organization
4. **Screenshots saved** - Visual record of all progress
5. **One terminal** - Don't make user manage multiple windows

---

## Open Questions (For Future)

1. Should we add a "Court of Appeals" feature? (re-analyze same evidence)
2. Should verdict cards have QR codes to the app?
3. Should we add sound effects? (gavel bang on verdict)
4. Should we support video evidence in future?

---

*Last updated: January 8, 2026*
*Created during initial build session with user*
