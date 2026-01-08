# JUDGE - AI Courtroom Verdict App

Analyzes conversations and disputes, delivers verdicts like a real courtroom.

## Folder Structure (Human-Friendly)

```
judge-app/
│
├── app/                          # The actual React web app
│   ├── src/                      # Source code
│   │   ├── components/           # Reusable UI pieces
│   │   ├── pages/                # Each screen of the app
│   │   ├── services/             # API calls, database
│   │   └── types/                # TypeScript definitions
│   └── public/                   # Static files
│
├── screenshots/                  # All app screenshots (auto + manual)
│   ├── home-screen/              # Home page versions
│   ├── verdict-screen/           # Verdict display versions
│   ├── upload-screen/            # Evidence upload versions
│   ├── history-screen/           # Case history versions
│   └── other/                    # Everything else
│
├── assets/                       # Design resources
│   ├── icons/                    # App icons, UI icons
│   ├── images/                   # Photos, illustrations
│   └── share-card-templates/     # Shareable verdict card designs
│
├── docs/                         # Documentation
│   ├── design-specs/             # Color codes, typography, etc.
│   └── api-examples/             # Gemini API request/response examples
│
├── scripts/                      # Helper tools
│   └── screenshot.mjs            # Auto-screenshot tool
│
├── PRD.json                      # Feature checklist (what to build)
├── CLAUDE.md                     # Instructions for Claude AI
└── README.md                     # This file
```

## Quick Commands

```bash
# Start the app (development)
cd app && npm run dev

# Take a screenshot
node scripts/screenshot.mjs home      # Screenshots home page
node scripts/screenshot.mjs verdict   # Screenshots verdict page
node scripts/screenshot.mjs upload    # Screenshots upload page

# Build for production
cd app && npm run build
```

## Color Scheme

| Color | Hex | Used For |
|-------|-----|----------|
| Black | #000000 | Background |
| White | #FFFFFF | Text |
| Gold | #D4A843 | Winners, headers, accents |
| Red | #FF3B3B | Warnings, toxicity |
| Purple | #8B5CF6 | Secondary accents |

## Features (from PRD.json)

1. Project setup - DONE
2. Home screen ("ALL RISE")
3. Screenshot upload (Exhibits A-J)
4. Text paste input
5. Processing screen ("JUDGE IS DELIBERATING")
6. Gemini AI integration
7. Verdict screen (winner, scores, analysis)
8. Share card generation
9. Case history
10. Settings
11. Polish & animations

## Screenshot Naming Convention

Files are named: `{page}-{device}-{date}_{time}.png`

Examples:
- `home-desktop-2026-01-08_12-30.png`
- `verdict-mobile-2026-01-08_12-35.png`
