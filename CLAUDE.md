# JUDGE - AI Courtroom Verdict App

## Natural Language Triggers (READ THIS FIRST)

When the user says ANY of these phrases, they want autonomous/ralph loop mode:
- "keep working until done"
- "ralph loop this"
- "autonomous mode"
- "don't stop" / "dont stop"
- "build it all"
- "finish this"
- "keep going until finished"

**When you detect these phrases, IMMEDIATELY respond with:**

```
AUTONOMOUS MODE REQUESTED

To start ralph loop, copy and run this command:

/ralph-loop "Build JUDGE app feature by feature using PRD.json" --max-iterations 50

Or for your autonomous.ps1:

autonomous "Build JUDGE app" -t "npm run build" -p "C:\Users\Admin\Desktop\judge-app\app" -y
```

Do NOT just start working - the user needs to invoke the external wrapper.

---

## Important Files to Read First

1. **PRD.json** - Feature list, what to build
2. **LOOP-INSTRUCTIONS.md** - Stuck detection, fail-safes
3. **docs/design-decisions.md** - WHY we made certain choices

---

## Quick Reference

**What is this?** Courtroom-themed AI app that analyzes conversations/disputes and delivers verdicts.

**Tech Stack:** React + Vite + TypeScript + TailwindCSS + Gemini API + IndexedDB

**Dev Server:** `cd app && npm run dev` → localhost:5173

**Run Tests:** `cd app && npm test`

## Design System (MEMORIZE THIS)

```
Background:     #000000 (pure black)
Text:           #FFFFFF (white)
Accent Red:     #FF3B3B (warnings, toxicity)
Accent Gold:    #D4A843 (verdicts, winners, headers)
Accent Purple:  #8B5CF6 (secondary accents)
```

**Typography:**
- Headers: Bold, uppercase, wide letter-spacing (tracking-widest)
- Body: Clean, high contrast
- Vibe: Law & Order meets Nuremberg - weighty, dramatic, official

**Voice:**
- Clinical and precise
- Brutally honest
- Legal terminology ("The court finds...", "Exhibit A shows...")
- Authoritative but entertaining

## Folder Structure

```
judge-app/
├── app/                    # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Screen components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API calls, IndexedDB
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   ├── public/
│   └── package.json
├── scripts/                # Automation scripts
│   └── screenshot.mjs      # Visual iteration helper
├── assets/                 # Design assets, icons
├── docs/                   # Documentation
├── .screenshots/           # Auto-captured screenshots
├── PRD.json               # Feature checklist
└── CLAUDE.md              # This file
```

## Visual Iteration Workflow

When building UI features:
1. Make changes to the code
2. Run `node scripts/screenshot.mjs` (or auto-triggered)
3. Screenshot saved to `.screenshots/`
4. Analyze screenshot, compare to design spec
5. Iterate until satisfied

## Gemini API

**Model for OCR:** gemini-1.5-flash (fast, cheap, good at vision)
**Model for Verdicts:** gemini-1.5-pro (better reasoning)

**Verdict Response Structure:**
```json
{
  "winner": "Party A" | "Party B" | "Draw",
  "winner_reason": "string",
  "credibility": {
    "partyA": 0-100,
    "partyB": 0-100
  },
  "toxicity": 0-100,
  "manipulation_tactics": [
    {"name": "Gaslighting", "evidence": "quote", "severity": "high"}
  ],
  "red_flags": [
    {"flag": "Main character syndrome", "party": "A", "evidence": "quote"}
  ],
  "evidence_log": [
    {"exhibit": "A", "summary": "string", "favors": "Party A"}
  ],
  "judges_opinion": "string (paragraph, legal style)",
  "recommendations": {
    "partyA": "string",
    "partyB": "string"
  }
}
```

## Key Screens

1. **Home** - "PRESENT YOUR CASE" + evidence type selection
2. **Upload Screenshots** - Drag-drop, exhibits A-J
3. **Paste Text** - Text area + party names + context
4. **Processing** - "JUDGE IS DELIBERATING" + animation
5. **Verdict** - Full analysis display
6. **Share** - Theme selector + downloadable card
7. **History** - Past cases list
8. **Settings** - App config

## Commands

```bash
# Development
cd app && npm run dev

# Build
cd app && npm run build

# Test
cd app && npm test

# Screenshot current state
node scripts/screenshot.mjs

# Validate PRD
validate-prd PRD.json
```

## Working on This Project

1. Check PRD.json for current feature (first where passes=false)
2. Build the feature
3. Screenshot and visually verify
4. Run tests
5. Mark passes=true in PRD.json
6. Commit
7. Move to next feature
