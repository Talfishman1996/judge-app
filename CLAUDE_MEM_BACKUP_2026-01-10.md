# JUDGE App - Memory Backup
**Date:** 2026-01-10
**Purpose:** Comprehensive reference document for continuing development

---

## Project Overview

**JUDGE** is a courtroom-themed AI application that analyzes conversations and disputes, then delivers dramatic verdicts. Think "Law & Order meets Nuremberg" - weighty, dramatic, and official.

The app takes evidence (screenshots or pasted text) and uses the Gemini API to analyze the conversation, determine a winner, assess credibility, identify manipulation tactics, and deliver a verdict in a clinical, legally-styled voice.

**Location:** `C:\Users\Admin\Desktop\judge-app`

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React | UI framework |
| Vite | Build tool and dev server |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| Gemini API | AI analysis (OCR + verdict generation) |
| IndexedDB | Local case history storage |

**Gemini Models:**
- `gemini-1.5-flash` - OCR/vision (fast, cheap)
- `gemini-1.5-pro` - Verdict generation (better reasoning)

**User Preference (2026-01-09):** Prefers Gemini 3 Flash over Pro - faster, more decisive, edgier verdicts.

---

## Design System

### Colors

```
Background:     #000000 (pure black)
Text:           #FFFFFF (white)
Accent Red:     #FF3B3B (warnings, toxicity, severe credibility <30%)
Accent Gold:    #D4A843 (verdicts, winners, headers)
Accent Purple:  #8B5CF6 (secondary accents)
```

**Note:** In Brutalist verdict design, gold/amber (#f59e0b) used for accents and headers; red reserved for severe credibility situations only.

### Typography

- **Headers:** Bold, uppercase, wide letter-spacing (`tracking-widest`)
- **Body:** Clean, high contrast
- **Fonts:** Monospace aesthetic for surveillance/brutalist feel

### Voice & Tone

- Clinical and precise
- Brutally honest (user wants edgy/savage, not corporate/safe)
- Legal terminology: "The court finds...", "Exhibit A shows..."
- Authoritative but entertaining
- Use "Playing the Victim" not "DARVO" (more universally understood)

### Visual Theme

**Aesthetic:** "Law & Order meets Nuremberg"
- Dark, weighty, dramatic
- Brutalist surveillance aesthetic
- Scan lines, red/amber colors
- Official document feel

---

## Verdict Response Structure (JSON Schema)

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
    {
      "name": "Gaslighting",
      "evidence": "quote from conversation",
      "severity": "high" | "medium" | "low"
    }
  ],
  "red_flags": [
    {
      "flag": "Main character syndrome",
      "party": "A" | "B",
      "evidence": "quote from conversation"
    }
  ],
  "evidence_log": [
    {
      "exhibit": "A",
      "summary": "Description of what this exhibit shows",
      "favors": "Party A" | "Party B" | "Neither"
    }
  ],
  "judges_opinion": "Paragraph in legal style with the judge's analysis and reasoning",
  "recommendations": {
    "partyA": "Specific advice for Party A",
    "partyB": "Specific advice for Party B"
  }
}
```

---

## Shame Tier System (Loser Shaming)

For the loser (51-100% wrong), a 10-tier shame system is applied:

| Credibility | Tier Name |
|-------------|-----------|
| 96-100% | SUSPECT |
| 91-95% | SUSPICIOUS |
| 86-90% | CAUGHT |
| 81-85% | EXPOSED |
| 76-80% | BUSTED |
| 71-75% | GUILTY |
| 66-70% | CONDEMNED |
| 61-65% | DESTROYED |
| 56-60% | ANNIHILATED |
| 51-55% | CLOWN STATUS |

Each tier has 3 curated iconic memes from imgflip.

**Design Decisions:**
- Static meme images (not GIFs) for better screenshot shareability
- Focus emphasis on LOSER (wrongdoer) with shame, not celebration of winner

---

## Key Screens

1. **Home** - "PRESENT YOUR CASE" header + evidence type selection buttons
2. **Upload Screenshots** - Drag-drop zone, exhibits labeled A-J, max 10 images
3. **Paste Text** - Large textarea + Party A/B name fields + context box
4. **Processing** - "JUDGE IS DELIBERATING" + gavel/scales animation
5. **Verdict** - Full analysis display with all verdict components
6. **Share** - Theme selector (black/purple/gold/red) + downloadable PNG card
7. **History** - Past cases list from IndexedDB, clickable to view
8. **Settings** - Clear history, about section, API key input

---

## Verdict Page Variants

Multiple verdict page designs have been created:

1. **Original** - Standard layout
2. **Summary** - Condensed view
3. **Story** - Narrative format
4. **Carousel** - Swipeable cards
5. **Tabloid** - News headline style
6. **Brutalist** - Surveillance/mugshot aesthetic (completed in VerdictPageBrutalist.tsx)

---

## MCP Memory Entities

The following entities are stored in the MCP Memory knowledge graph:

### JUDGE_App (Project)
- React + Vite + TypeScript + TailwindCSS courtroom verdict app
- Analyzes conversations/disputes using Gemini API
- Brutalist surveillance aesthetic with scan lines, red/amber colors, monospace fonts
- Features meme tier system for loser shaming (51-100% wrong)
- Multiple verdict page variants
- Located at C:\Users\Admin\Desktop\judge-app

### JUDGE App Verdict Design (Feature)
- VerdictPageBrutalist.tsx completed with surveillance/mugshot aesthetic
- Color scheme: Gold/amber for accents, red only for severe credibility (<30%)
- 10 shame tiers with curated imgflip memes
- User preferences for static images and loser emphasis

### Design_System (Configuration)
- All color values and typography rules
- Voice guidelines
- Visual theme description

### User_Preferences (Preferences)
- Gemini 3 Flash preferred over Pro
- Wants edgy/savage verdicts
- Tests on iPhone via Cloudflare tunnel or Pages deployment
- Incremental memory saves preferred
- Static memes over GIFs
- "Playing the Victim" terminology over "DARVO"

---

## Commands Reference

```bash
# Development server (localhost:5173)
cd app && npm run dev

# Production build
cd app && npm run build

# Run tests
cd app && npm test

# Take screenshot for visual verification
node scripts/screenshot.mjs

# Validate PRD features
validate-prd PRD.json
```

---

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
└── CLAUDE.md              # Project instructions
```

---

## PRD Workflow Approach

The project uses a structured Product Requirements Document (PRD.json) approach:

1. **Check PRD.json** for current feature (first where `passes: false`)
2. **Build the feature** according to acceptance criteria
3. **Screenshot and visually verify** against design spec
4. **Run tests** to ensure no regressions
5. **Mark `passes: true`** in PRD.json when complete
6. **Commit** the changes
7. **Move to next feature**

### Current PRD Status (All Features Complete)

| ID | Feature | Status |
|----|---------|--------|
| 1 | Project scaffolding and base setup | COMPLETE |
| 2 | Home screen - ALL RISE | COMPLETE |
| 3 | Evidence submission - Screenshots | COMPLETE |
| 4 | Evidence submission - Text input | COMPLETE |
| 5 | Processing screen - Deliberation | COMPLETE |
| 6 | Gemini API integration | COMPLETE |
| 7 | Verdict screen - Full analysis display | COMPLETE |
| 8 | Share card generation | COMPLETE |
| 9 | Case history with IndexedDB | COMPLETE |
| 10 | Settings screen | COMPLETE |
| 11 | Polish and visual refinement | COMPLETE |

---

## Autonomous Development (Ralph Loop)

For multi-step tasks, use the Ralph Loop autonomous development mode:

```bash
# Using ralph-loop skill
/ralph-loop "Build JUDGE feature: [FEATURE]" --max-iterations 30 --completion-promise "BUILD_PASSES"

# Using external autonomous wrapper
autonomous "Build JUDGE app" -t "cd app && npm run build" -p "C:\Users\Admin\Desktop\judge-app" -y
```

**Trigger Phrases:**
- "keep working until done"
- "ralph loop this"
- "autonomous mode"
- "don't stop"
- "build it all"
- "finish this"

---

## Visual Iteration Workflow

When building UI features:

1. Make changes to the code
2. Run `node scripts/screenshot.mjs` (or auto-triggered)
3. Screenshot saved to `.screenshots/`
4. Analyze screenshot, compare to design spec
5. Iterate until satisfied

---

## User Testing Environment

- Tests on iPhone via Cloudflare tunnel
- Also uses Cloudflare Pages deployment
- Prefers mobile-first verification

---

## Session Continuity Notes

- Save to MCP Memory frequently throughout conversations
- Save after: completing features, making design decisions, solving tricky bugs, learning user preferences
- Don't wait until end of conversation - do it incrementally
- claude-mem is for user context and session continuity
- Research data goes in project files, not memory systems

---

## Key Design Decisions (Historical)

1. **Brutalist over polished** - Surveillance/mugshot aesthetic chosen for drama
2. **Gold for wins, red for severe only** - Red reserved for credibility <30%
3. **Static memes** - Better for screenshot sharing than GIFs
4. **"Playing the Victim" terminology** - More universally understood than "DARVO"
5. **Loser emphasis** - Focus on shaming wrongdoer, not celebrating winner
6. **Gemini 3 Flash** - Faster, more decisive, edgier than Pro model

---

*This backup was generated from MCP Memory entities, project CLAUDE.md, and PRD.json on 2026-01-10.*
