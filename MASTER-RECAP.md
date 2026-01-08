# JUDGE APP - HYPER-DETAILED MASTER RECAP

## From All Angles: Macro to Micro

---

# TABLE OF CONTENTS

1. [MACRO VIEW: The Big Picture](#part-1-macro-view)
2. [THE PRODUCT: What We're Building](#part-2-the-product)
3. [COMPETITIVE LANDSCAPE: Who Else Is Doing This](#part-3-competitive-landscape)
4. [RESEARCH GOLDMINES: What We Discovered](#part-4-research-goldmines)
5. [CURRENT PROJECT STATE: Where We Are](#part-5-current-project-state)
6. [WHAT'S BROKEN: Known Issues](#part-6-whats-broken)
7. [THE FIX: Technical Solutions](#part-7-the-fix)
8. [WORKFLOW REVOLUTION: Ralph Loop + Claude-Mem](#part-8-workflow-revolution)
9. [SLANG & TERMINOLOGY: The Voice](#part-9-slang-terminology)
10. [DESIGN SYSTEM: Visual Language](#part-10-design-system)
11. [TECHNICAL ARCHITECTURE: The Stack](#part-11-technical-architecture)
12. [MONETIZATION: Making Money](#part-12-monetization)
13. [VIRALITY: Growth Strategy](#part-13-virality)
14. [FILE-BY-FILE: What Changes](#part-14-file-by-file)
15. [ACTION PLAN: What To Do Now](#part-15-action-plan)

---

<a name="part-1-macro-view"></a>
# PART 1: MACRO VIEW - The Big Picture

## 1.1 The Vision (30,000 Foot View)

**JUDGE** is a courtroom-themed AI app that:
- Analyzes arguments/disputes between two people
- Delivers dramatic legal-style verdicts
- Generates shareable verdict cards for social media
- Uses Gen-Z friendly terminology
- Has viral potential through controversy and shareability

## 1.2 The Market Opportunity

| Insight | Source |
|---------|--------|
| 41% of Gen Z adults have used AI for relationship advice | Service95 |
| 72% of teens 13-17 have used an AI companion | Common Sense Media 2025 |
| ChatGPT reached 1 billion downloads in July 2025 | a16z State of Consumer AI |
| r/AmITheAsshole has millions of daily users seeking judgment | Wikipedia |

## 1.3 The Core Insight

> "People screenshot arguments and send to friends asking 'am I crazy?' This app formalizes that."

The behavior already exists. JUDGE just makes it:
- Faster (AI vs. waiting for friends)
- More authoritative (legal theming)
- More shareable (verdict cards)
- More entertaining (dramatic presentation)

## 1.4 The Viral Hook

| Element | Why It Works |
|---------|--------------|
| **Controversy** | People share verdicts they disagree with |
| **Validation** | Winners share their victories |
| **Entertainment** | Voyeurism - browsing others' cases |
| **Social proof** | "The AI agrees with me" |

## 1.5 Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| K-factor | >0.5 | Each share brings 0.5+ new users |
| Daily verdicts | 1,000+ | Within first month |
| Share rate | >30% | Users sharing verdict cards |
| Retention D7 | >20% | Users returning after a week |

---

<a name="part-2-the-product"></a>
# PART 2: THE PRODUCT - What We're Building

## 2.1 User Flow (Complete Journey)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │  HOME   │───▶│ SUBMIT  │───▶│DELIBERATE│───▶│ VERDICT │     │
│  │         │    │EVIDENCE │    │         │    │         │     │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘     │
│       │              │                              │          │
│       │         ┌────┴────┐                   ┌────┴────┐     │
│       │         │Screenshots│                  │  SHARE  │     │
│       │         │   OR     │                  │  CARD   │     │
│       │         │  Text    │                  └────┬────┘     │
│       │         └──────────┘                       │          │
│       │                                            │          │
│       ▼                                            ▼          │
│  ┌─────────┐                                 ┌─────────┐     │
│  │ HISTORY │◀────────────────────────────────│  SAVE   │     │
│  │         │                                 │         │     │
│  └─────────┘                                 └─────────┘     │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Screen-by-Screen Breakdown

### Screen 1: HOME - "ALL RISE"

**Purpose:** Dramatic entry, set the tone, choose evidence type

**Elements:**
| Element | Description | Animation |
|---------|-------------|-----------|
| "ALL RISE" header | Gold, 6xl, ultrawide tracking | Fade up + scale |
| "THE COURT IS NOW IN SESSION" | White/60% opacity | Fade in after header |
| "PRESENT YOUR CASE" | White, 3xl | Static |
| Upload Screenshots button | Gold border, gold text | Hover: fill gold |
| Paste Text button | Purple border, purple text | Hover: fill purple |
| "Justice will be served" | White/40%, small | Static |

**User Actions:**
- Click "Upload Screenshots" → Navigate to Upload screen
- Click "Paste Text" → Navigate to Text Input screen
- Click History icon → Navigate to History screen

---

### Screen 2a: UPLOAD SCREENSHOTS

**Purpose:** Upload 1-10 screenshots, labeled as Exhibits A-J

**Elements:**
| Element | Description |
|---------|-------------|
| Drag-drop zone | Dashed border, "Drop evidence here" |
| File picker | "or click to browse" |
| Exhibit grid | 2x5 grid showing uploads as "EXHIBIT A", "EXHIBIT B", etc. |
| Remove buttons | X on each exhibit thumbnail |
| Counter | "3/10 exhibits submitted" |
| Submit button | Gold, disabled until ≥1 image |

**Technical:**
- Accept: image/png, image/jpeg, image/webp
- Max file size: 10MB each
- Convert to base64 for Gemini API
- Store in state, not uploaded anywhere

---

### Screen 2b: TEXT INPUT

**Purpose:** Paste conversation text with party names and context

**Elements:**
| Element | Description |
|---------|-------------|
| Party A name input | "Who is Party A? (e.g., 'My boyfriend')" |
| Party B name input | "Who is Party B? (e.g., 'Me')" |
| Conversation textarea | Large, "Paste the conversation here..." |
| Context textarea | Smaller, "Any additional context?" |
| Character count | "1,234 / 50,000 characters" |
| Submit button | Gold, disabled until valid |

**Validation:**
- Party A name: required, 1-50 chars
- Party B name: required, 1-50 chars
- Conversation: required, 10-50,000 chars
- Context: optional, 0-5,000 chars

---

### Screen 3: DELIBERATION

**Purpose:** Build suspense while AI analyzes

**Elements:**
| Element | Description | Animation |
|---------|-------------|-----------|
| "THE JUDGE IS DELIBERATING" | Gold, large | Pulse glow |
| Scales of justice icon | SVG, centered | Gentle rock/sway |
| Progress dots | "Analyzing evidence..." | Sequential fade |
| Dramatic quotes | Rotating legal phrases | Fade in/out |

**Quotes rotation:**
- "Reviewing the evidence..."
- "Weighing credibility..."
- "Consulting precedent..."
- "Reaching a verdict..."

**Duration:** 3-8 seconds (actual API time + minimum 3s for drama)

---

### Screen 4: VERDICT

**Purpose:** Display full analysis with winner, stats, and breakdown

**Layout:**
```
┌─────────────────────────────────────────┐
│           🏆 PARTY A WINS 🏆            │  ← Hero card (gold)
│     "Party B fumbled this, no cap"      │
├─────────────────────────────────────────┤
│  CREDIBILITY                            │
│  Party A: ████████████░░ 78%            │
│  Party B: ██████░░░░░░░░ 45%            │
├─────────────────────────────────────────┤
│  TOXICITY LEVEL                         │
│  ████████████████░░░░ 72% 🚩            │  ← Red gradient
├─────────────────────────────────────────┤
│  MANIPULATION TACTICS DETECTED          │
│  • Gaslighting (HIGH) - "You never..."  │
│  • Stonewalling (MED) - refused to...   │
├─────────────────────────────────────────┤
│  RED FLAGS 🚩                           │
│  • The ick: passive-aggressive tone     │
│  • Sus: story doesn't add up            │
├─────────────────────────────────────────┤
│  EVIDENCE LOG                           │
│  Exhibit A: Favors Party A              │
│  Exhibit B: Neutral                     │
│  Exhibit C: Favors Party A              │
├─────────────────────────────────────────┤
│  JUDGE'S OPINION                        │
│  "The court finds that Party B          │
│   exhibited classic stonewalling..."    │
├─────────────────────────────────────────┤
│  COURT RECOMMENDATIONS                  │
│  To Party A: "Set boundaries..."        │
│  To Party B: "Touch grass..."           │
├─────────────────────────────────────────┤
│  [SHARE VERDICT]  [NEW CASE]  [SAVE]    │
└─────────────────────────────────────────┘
```

---

### Screen 5: SHARE CARD

**Purpose:** Generate downloadable/shareable verdict image

**Elements:**
| Element | Description |
|---------|-------------|
| Card preview | Live preview of generated card |
| Theme selector | Black / Gold / Purple / Red |
| Download button | "Download PNG" |
| Share button | Native share (Web Share API) |
| Copy button | Copy image to clipboard |

**Card dimensions:** 1200x630px (optimal for Twitter/OG)

**Card contents:**
```
┌─────────────────────────────────────┐
│  ⚖️ JUDGE                          │
│  ─────────────────────────────────  │
│                                     │
│        PARTY A WINS                 │
│                                     │
│   Credibility: 78% vs 45%           │
│   Toxicity: 72%                     │
│                                     │
│   "Party B ate, left no crumbs"     │
│                                     │
│  ─────────────────────────────────  │
│  judge.app • Get your verdict       │
└─────────────────────────────────────┘
```

---

### Screen 6: HISTORY

**Purpose:** View past cases

**Elements:**
| Element | Description |
|---------|-------------|
| Case list | Cards with date, parties, winner |
| Search/filter | By date, winner, keyword |
| Delete button | Swipe or X to remove |
| Tap to view | Opens full verdict |

**Storage:** IndexedDB (persists across sessions)

---

### Screen 7: SETTINGS

**Purpose:** App configuration

**Elements:**
| Element | Description |
|---------|-------------|
| Sound effects toggle | On/Off (gavel sound) |
| Clear history | Confirmation dialog |
| About | Version, credits |
| API key input | Optional, for self-hosting |

---

## 2.3 AI Response Structure

```typescript
interface Verdict {
  winner: "Party A" | "Party B" | "Draw";
  winner_reason: string; // 1-2 sentences, uses slang

  credibility: {
    partyA: number; // 0-100
    partyB: number; // 0-100
  };

  toxicity: number; // 0-100, overall conversation toxicity

  manipulation_tactics: Array<{
    name: "Gaslighting" | "Stonewalling" | "Love bombing" | "DARVO" | "Guilt-tripping" | "Deflection";
    evidence: string; // Direct quote
    severity: "high" | "medium" | "low";
    party: "A" | "B";
  }>;

  red_flags: Array<{
    flag: string; // Gen-Z terminology
    party: "A" | "B";
    evidence: string;
  }>;

  evidence_log: Array<{
    exhibit: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";
    summary: string;
    favors: "Party A" | "Party B" | "Neutral";
  }>;

  judges_opinion: string; // 2-3 paragraphs, legal style but accessible

  recommendations: {
    partyA: string;
    partyB: string;
  };
}
```

---

<a name="part-3-competitive-landscape"></a>
# PART 3: COMPETITIVE LANDSCAPE

## 3.1 Direct Competitors Analyzed

| App | URL | What It Does | Strengths | Weaknesses |
|-----|-----|--------------|-----------|------------|
| **AI Judge** | aijudge.vercel.app | 7 AI judges vote on arguments | Multiple perspectives, gamified | No shareable cards, basic UI, text-only |
| **You're Wrong** | yourewrong.app | Verdicts + relationship advice | Browse anonymous cases (voyeurism) | Crowdsourced not pure AI, messy UI |
| **AreYouTheAsshole** | areyoutheasshole.com | AI trained on r/AITA | 3 biased models (fun gimmick) | No image upload, text-only, novelty only |
| **Goblin Tools - The Judge** | goblin.tools/Judge | Tone/sentiment analysis | Part of useful toolkit | No verdict, just analysis, not entertaining |
| **Ember AI** | App Store | Relationship coaching | Text analyzer feature | Subscription model, broad focus, not viral |
| **ChatGPT Relationship Analyzer** | ChatGPT GPT | Custom GPT for arguments | Free if you have Plus | Requires ChatGPT subscription |

## 3.2 JUDGE's Competitive Advantages

| Feature | JUDGE | AI Judge | You're Wrong | AITA |
|---------|-------|----------|--------------|------|
| Screenshot upload + OCR | ✅ | ❌ | ❌ | ❌ |
| Shareable verdict cards | ✅ | ❌ | ❌ | ❌ |
| Dramatic courtroom theming | ✅ | ⚠️ Basic | ❌ | ❌ |
| Exhibit labeling (A-J) | ✅ | ❌ | ❌ | ❌ |
| Gen-Z terminology | ✅ | ❌ | ⚠️ Some | ✅ |
| Manipulation detection | ✅ | ❌ | ❌ | ❌ |
| Case history | ✅ | ❌ | ✅ | ❌ |
| Sound effects | ✅ | ❌ | ❌ | ❌ |

## 3.3 Key Insight from Competitors

> **AreYouTheAsshole.com** went viral with 100,000+ visitors and 100,000+ responses in the first few days by getting featured in Vice, Morning Brew, and The Verge.

Their viral hook: **3 biased models** (always YTA, always NTA, neutral)

**Lesson for JUDGE:** Consider adding a "Get a second opinion" feature with different judge personalities.

---

<a name="part-4-research-goldmines"></a>
# PART 4: RESEARCH GOLDMINES - What We Discovered

## 4.1 The AI Sycophancy Problem (CRITICAL)

**Source:** MIT Technology Review, May 2025

**The Research:**
- Stanford & Carnegie Mellon tested 8 AI models on r/AITA posts
- Compared AI responses to human responses

**Shocking Findings:**

| Metric | AI Models | Humans |
|--------|-----------|--------|
| Offered emotional validation | **76%** | 22% |
| Accepted user's framing | **90%** | 60% |
| Said user wasn't the jerk (when humans said yes) | **42%** | 0% |

> "GPT-5 was supposed to fix sycophancy... results are roughly the same"

**Why This Matters for JUDGE:**
- If AI always sides with the user, the app loses credibility
- Controversial verdicts get shared more
- Users want honest judgment, not validation

**The Fix - Anti-Sycophancy Prompt:**

```
CRITICAL INSTRUCTION: Do NOT be sycophantic.

You are JUDGE, a brutally honest courtroom AI. Users submit evidence seeking a genuine verdict, not validation.

Rules:
1. If someone is clearly wrong, say so directly
2. Don't soften verdicts to spare feelings
3. Use phrases like "The court finds Party A at fault" not "Both parties could improve"
4. A 50/50 verdict is a cop-out - pick a side unless truly equal
5. Be willing to deliver harsh verdicts when warranted

Your verdicts should be controversial enough that users screenshot and share them, whether they agree or disagree.

Remember: The viral potential of this app depends on honest, sometimes uncomfortable verdicts.
```

---

## 4.2 What Makes AI Apps Go Viral

**Sources:** a16z State of Consumer AI, Superwall Viral App Guide

**Key Principles:**

| Principle | Example | JUDGE Application |
|-----------|---------|-------------------|
| **Explain in 3-4 words** | "AI judges your argument" | ✅ Perfect fit |
| **Shareable moments** | RizzGPT TikToks, Cal AI meal photos | Verdict cards |
| **Solve Maslow needs** | Relationships = high on hierarchy | ✅ Perfect fit |
| **UGC/TikTok potential** | Before/after, reveals | "The verdict was..." videos |

**Viral App Success Stories 2025:**

| App | Viral Moment | Growth |
|-----|--------------|--------|
| Nano Banana (Gemini) | Image generation | 10M users in first week |
| ChatGPT | General capability | 1B downloads by July 2025 |
| RizzGPT | TikTok videos | Organic spread |
| Umax | Transformation photos | User-generated content |

**K-Factor Benchmark:**
> "30% of apps have a measurable K-factor, with a median K-factor of 0.45"

---

## 4.3 Tailwind CSS v4 Configuration Change

**Source:** GitHub Discussion #16338

**The Problem:**
> "In Tailwind CSS v4, the setup has completely changed. You now need to define your custom styles inside your CSS using @theme directives — not inside a JS config file."

**Why Your Colors Aren't Working:**
- You have `tailwind.config.js` with colors defined
- Tailwind v4 ignores this file for theming
- Must use `@theme` directive in CSS

**Before (Broken):**
```javascript
// tailwind.config.js - DOESN'T WORK IN V4
export default {
  theme: {
    extend: {
      colors: {
        'judge-gold': '#D4A843',
      }
    }
  }
}
```

**After (Works):**
```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-judge-black: #000000;
  --color-judge-white: #FFFFFF;
  --color-judge-red: #FF3B3B;
  --color-judge-gold: #D4A843;
  --color-judge-purple: #8B5CF6;

  --letter-spacing-ultrawide: 0.25em;
}
```

---

## 4.4 Ralph Loop Best Practices

**Sources:** Official Plugin, Matt Pocock on X, Paddo.dev Guide

**What Is Ralph Loop:**
> "A simple while loop that repeatedly feeds an AI agent a prompt until completion. Named after Ralph Wiggum from The Simpsons."

**How It Works:**
```
1. You give Claude a task
2. Claude works on it
3. Claude tries to exit
4. Stop hook intercepts
5. Same prompt fed back in
6. Claude sees its previous changes
7. Repeat until completion criteria met
```

**Best Practices:**

| Practice | Bad Example | Good Example |
|----------|-------------|--------------|
| Define precise exit criteria | "Build a todo API and make it good" | "Build REST API with CRUD. Tests must pass (>80% coverage). Output `<promise>COMPLETE</promise>` when done." |
| Set max iterations | No limit | `--max-iterations 50` |
| Include verification | "Write code for feature X" | "Implement feature, run tests, fix failures, repeat until green" |
| Use binary completion | "Make it better" | "All tests pass AND build succeeds" |

**Real Results:**
- Geoffrey Huntley: 3-month loop built complete programming language
- YC hackathon teams: 6+ repos overnight for $297

---

## 4.5 Claude-Mem for Context Persistence

**Source:** GitHub claude-mem

**The Problem:**
> "Claude Code's context loss between sessions creates significant workflow disruptions"
> "Auto-compact keeps resetting to 4-6% remaining, causing compaction loop"

**What Claude-Mem Does:**
- Automatically captures every tool usage
- Compresses with AI and stores in SQLite + ChromaDB
- Injects relevant context into future sessions
- Semantic search finds related past work

**Key Features:**

| Feature | Description |
|---------|-------------|
| Persistent memory | Survives disconnections and restarts |
| Progressive disclosure | Layered retrieval (IDs → timeline → full details) |
| Token efficiency | ~10x savings by filtering before fetching |
| Web viewer | Real-time access at localhost:37777 |
| Endless Mode (beta) | Extended sessions without compaction |

**Installation:**
```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

---

## 4.6 Gemini API Pricing

**Source:** Google AI Pricing

**Costs:**

| Operation | Model | Cost |
|-----------|-------|------|
| Image input (OCR) | Gemini 2.5 Flash | $0.0011/image |
| Text input | Gemini 3 Pro | $0.00125/1K tokens |
| Text output | Gemini 3 Pro | $0.005/1K tokens |

**Cost Per Verdict:**

| Scenario | Estimated Cost |
|----------|---------------|
| 1 screenshot | ~$0.02 |
| 5 screenshots | ~$0.04 |
| 10 screenshots | ~$0.05 |
| Text-only | ~$0.02 |

**Free Tier:**
> "Google AI Studio provides completely free access with a generous daily limit of 1,500 images"

---

## 4.7 React Project Structure

**Source:** Robin Wieruch

**Key Insight:**
> "Start with a minimal structure and refactor as your application grows. Premature optimization often creates more problems than it solves."

> "If you're just starting a project, don't spend more than five minutes on choosing a file structure."

**Recommendation:**
- Start flat
- Create folders when you have 3+ related files
- Delete empty folders
- Maximum 2-3 levels of nesting

---

## 4.8 Shareable Card Generation

**Source:** npm-compare html-to-image

**Recommendation: Use html-to-image**

> "For 90% of use cases—exporting dashboards, generating social share images—html-to-image is the superior choice."

**Why Not html2canvas:**
- Author considers it "experimental"
- Doesn't support CSS variables well
- html-to-image has better font/SVG rendering

**Image Sizes for Social:**

| Platform | Size | Ratio |
|----------|------|-------|
| Twitter/X | 1200x630 | 1.9:1 |
| Facebook | 1200x630 | 1.9:1 |
| Instagram | 1080x1080 | 1:1 |
| **Recommended** | **1200x630** | Works everywhere |

---

## 4.9 Web Share API

**Source:** MDN Web Share

**What It Does:**
- Native share sheet on mobile
- Share files (including images) directly
- No need for platform-specific SDKs

**Support:**
- iOS Safari: ✅
- Android Chrome: ✅
- Desktop Chrome: ✅
- Firefox: ⚠️ Limited

---

## 4.10 Animation Libraries

**Source:** Semaphore Comparison

**Recommendation: Motion (formerly Framer Motion)**

> "Motion (prev Framer Motion) is a fast, production-grade web animation library for React"

**Why Motion:**
- Declarative API (React-friendly)
- Great for enter/exit animations
- Layout animations built-in
- Good performance

**When to use GSAP instead:**
- Complex timeline sequences
- Scroll-driven animations
- Canvas/WebGL integration

---

## 4.11 Sound Effects

**Sources:** MDN Web Audio, Uppbeat

**Free Gavel Sounds:**
- Uppbeat: Free with attribution
- ElevenLabs: Free tier available
- Soundsnap: Subscription required

**Implementation:** Simple HTML5 Audio for single sound effects (Web Audio API overkill)

---

## 4.12 PWA Strategy

**Source:** Multiple PWA articles

**Key Finding:**
> "Pinterest PWA: time spent up 40%, ad revenue up 44%, core engagements up 60%"

**Web Share Target (Future Feature):**
> "Nearly a quarter of all daily conversions getting initiated through the share menu"

Users could share screenshots directly TO JUDGE from their photo app.

**Recommendation:**
1. MVP: Regular web app
2. Phase 2: Add PWA manifest
3. Phase 3: Add Web Share Target

---

## 4.13 Monetization

**Source:** RevenueCat Trends

**Key Insight:**
> "For AI-driven apps, expect usage-based monetization—whether through credits, coins, or capped tiers—to become dominant"

**Recommended Model:**

| Tier | Price | Credits | Target |
|------|-------|---------|--------|
| Free | $0 | 3 verdicts/day | Trial users |
| Plus | $4.99/mo | 50 verdicts/mo | Casual users |
| Pro | $9.99/mo | Unlimited | Power users |

**Conversion Benchmark:** 2-5% of free users become paying

---

<a name="part-5-current-project-state"></a>
# PART 5: CURRENT PROJECT STATE

## 5.1 File Structure (Current)

```
C:\Users\Admin\Desktop\judge-app\
│
├── app\                              # React application
│   ├── node_modules\                 # Dependencies
│   ├── public\
│   │   └── vite.svg
│   ├── src\
│   │   ├── assets\
│   │   │   └── react.svg
│   │   ├── components\               # EMPTY ❌
│   │   ├── pages\                    # EMPTY ❌
│   │   ├── hooks\                    # EMPTY ❌
│   │   ├── services\                 # EMPTY ❌
│   │   ├── types\                    # EMPTY ❌
│   │   ├── utils\                    # EMPTY ❌
│   │   ├── App.tsx                   # Has home screen code
│   │   ├── App.css                   # Minimal
│   │   ├── index.css                 # Tailwind imports
│   │   ├── main.tsx                  # Entry point
│   │   └── vite-env.d.ts
│   ├── .env                          # API key ✅
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js            # BROKEN - v4 ignores this ❌
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── screenshots\
│   ├── home-screen\                  # 4 screenshots exist
│   ├── verdict-screen\               # EMPTY
│   ├── upload-screen\                # EMPTY
│   └── history-screen\               # EMPTY
│
├── scripts\
│   ├── node_modules\
│   ├── package.json
│   └── screenshot.mjs                # Puppeteer screenshot tool
│
├── assets\
│   ├── icons\                        # EMPTY
│   ├── images\                       # EMPTY
│   └── share-card-templates\         # EMPTY
│
├── docs\
│   └── design-decisions.md           # Exists
│
├── BUILD.cmd                         # Redundant ❌
├── BUILD-AUTO.cmd                    # Redundant ❌
├── BUILD-AUTO.ps1                    # Main launcher
├── start-claude.ps1                  # Redundant ❌
├── CLAUDE.md                         # Exists, too complex
├── LOOP-INSTRUCTIONS.md              # Should merge into CLAUDE.md
├── PRD.json                          # Source of truth ✅
├── README.md
└── SESSION-CONTEXT-FULL.md           # This was our context file
```

## 5.2 PRD.json Status

| # | Feature | Status | Blockers |
|---|---------|--------|----------|
| 1 | Project scaffolding | `passes: false` | Tailwind v4 colors broken |
| 2 | Home screen | `passes: false` | Depends on #1 |
| 3 | Screenshot upload | `passes: false` | Not started |
| 4 | Text input | `passes: false` | Not started |
| 5 | Deliberation screen | `passes: false` | Not started |
| 6 | Gemini API | `passes: false` | API key ready |
| 7 | Verdict screen | `passes: false` | Not started |
| 8 | Share cards | `passes: false` | Not started |
| 9 | Case history | `passes: false` | Not started |
| 10 | Settings | `passes: false` | Not started |
| 11 | Polish | `passes: false` | Not started |

## 5.3 Current App.tsx

```tsx
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-judge-black flex flex-col items-center justify-center p-8">
      {/* ALL RISE Header */}
      <div className="text-center mb-12">
        <h1 className="text-judge-gold text-6xl font-bold tracking-ultrawide mb-4 text-shadow-glow">
          ALL RISE
        </h1>
        <p className="text-judge-white/60 text-lg tracking-wider">
          THE COURT IS NOW IN SESSION
        </p>
      </div>

      {/* Main Header */}
      <h2 className="text-judge-white text-3xl font-bold tracking-widest mb-12 text-center">
        PRESENT YOUR CASE
      </h2>

      {/* Evidence Type Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button className="flex-1 bg-transparent border-2 border-judge-gold text-judge-gold py-4 px-8 text-lg font-bold tracking-wider hover:bg-judge-gold hover:text-judge-black transition-all duration-300">
          UPLOAD SCREENSHOTS
        </button>
        <button className="flex-1 bg-transparent border-2 border-judge-purple text-judge-purple py-4 px-8 text-lg font-bold tracking-wider hover:bg-judge-purple hover:text-judge-black transition-all duration-300">
          PASTE TEXT
        </button>
      </div>

      {/* Footer */}
      <p className="text-judge-white/40 text-sm mt-16 tracking-wide">
        Justice will be served
      </p>
    </div>
  )
}

export default App
```

**Problem:** All `judge-*` classes render as defaults because Tailwind v4 ignores config.js

---

<a name="part-6-whats-broken"></a>
# PART 6: WHAT'S BROKEN

## 6.1 Critical Issues

| Issue | Symptom | Root Cause | Impact |
|-------|---------|------------|--------|
| **Tailwind v4 colors** | `text-judge-gold` shows white | Config.js ignored in v4 | Can't see UI |
| **Buttons invisible** | Buttons exist but can't see | Same as above | Unusable |
| **Context loss** | Auto-compact loses details | No persistence strategy | Productivity |
| **Multiple launchers** | 4 scripts doing same thing | Over-engineering | Confusion |
| **Empty folders** | 6 empty folders | Premature structure | Clutter |
| **Too many docs** | 3 instruction files | Redundancy | Confusion |

## 6.2 Non-Critical Issues

| Issue | Symptom | Impact |
|-------|---------|--------|
| Port conflict | Uses 5174 instead of 5173 | Minor inconvenience |
| SQLite error | claude-mem bindings | Use file-based memory instead |
| No progress.txt | Ralph loop can't track | Add before loop |

---

<a name="part-7-the-fix"></a>
# PART 7: THE FIX - Technical Solutions

## 7.1 Fix Tailwind v4 Colors

**Delete:** `app/tailwind.config.js`

**Update:** `app/src/index.css`

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-judge-black: #000000;
  --color-judge-white: #FFFFFF;
  --color-judge-red: #FF3B3B;
  --color-judge-gold: #D4A843;
  --color-judge-purple: #8B5CF6;

  /* Typography */
  --font-family-display: 'Inter', system-ui, sans-serif;
  --letter-spacing-ultrawide: 0.25em;
}

/* Base styles */
body {
  background-color: var(--color-judge-black);
  color: var(--color-judge-white);
  font-family: var(--font-family-display);
}
```

## 7.2 New CLAUDE.md (Under 100 Lines)

```markdown
# JUDGE App

## What
Courtroom AI app - analyzes arguments, delivers verdicts, generates shareable cards.

## Tech
React + Vite + TypeScript + TailwindCSS v4 + Gemini 3 Pro + IndexedDB

## Commands
cd app && npm run dev    # Start dev server (localhost:5173)
cd app && npm run build  # Build (must pass before commit)

## Current Task
Check PRD.json - work on first feature where `passes: false`.

## Colors (defined in index.css @theme)
- judge-black: #000000
- judge-gold: #D4A843
- judge-red: #FF3B3B
- judge-purple: #8B5CF6
- judge-white: #FFFFFF

## Workflow
1. Read PRD.json, find first `passes: false`
2. Build that ONE feature
3. Run `npm run build` - must succeed
4. Update PRD.json: `passes: true`
5. Commit: `git commit -m "feat: [feature name]"`
6. Append to progress.txt: `[date] - Completed: [feature]`
7. Next feature

## If Stuck (3+ attempts same error)
Output: `BLOCKED: [describe the issue]`

## Anti-Sycophancy (Critical for Verdicts)
AI must NOT be a pushover. Deliver honest, sometimes harsh verdicts.
Users want genuine judgment, not validation.
Controversial verdicts get shared more.

## Slang to Use in Verdicts
Tier 1 (use freely): red flag, green flag, gaslighting, toxic, the ick, sus, valid, no cap
Tier 2 (use sparingly): ate, slay, cooked, delulu, love bombing, stonewalling
Avoid: groundhogging, cushioning, 67, clanker, demure

## Key Files
- PRD.json - Feature list and status
- progress.txt - Append-only log
- app/src/index.css - Tailwind @theme colors
```

## 7.3 Create progress.txt

```
# JUDGE App Progress Log
# Append only - do not edit previous entries

[2026-01-08] Project setup complete, ready for feature development
```

## 7.4 Consolidated run.ps1

```powershell
# run.ps1 - Single launcher for JUDGE app
param(
    [switch]$Auto,      # Run autonomous ralph loop
    [switch]$Dev,       # Just start dev server
    [switch]$Build      # Run production build
)

$projectPath = "C:\Users\Admin\Desktop\judge-app"
$appPath = "$projectPath\app"

if ($Dev) {
    Write-Host "Starting dev server..." -ForegroundColor Cyan
    Set-Location $appPath
    npm run dev
}
elseif ($Build) {
    Write-Host "Running production build..." -ForegroundColor Cyan
    Set-Location $appPath
    npm run build
}
elseif ($Auto) {
    Write-Host "Starting autonomous build..." -ForegroundColor Yellow
    Write-Host "Make sure claude-mem and ralph-wiggum plugins are installed" -ForegroundColor Gray

    # Start dev server in background
    $devJob = Start-Job -ScriptBlock {
        Set-Location $using:appPath
        npm run dev
    }

    Start-Sleep -Seconds 5

    # Start Claude with ralph loop
    Set-Location $projectPath
    claude --dangerously-skip-permissions

    # Cleanup
    Stop-Job $devJob
    Remove-Job $devJob
}
else {
    Write-Host "Usage:" -ForegroundColor White
    Write-Host "  .\run.ps1 -Dev    # Start dev server" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Build  # Production build" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Auto   # Autonomous ralph loop" -ForegroundColor Gray
}
```

---

<a name="part-8-workflow-revolution"></a>
# PART 8: WORKFLOW REVOLUTION

## 8.1 The Problem with Current Workflow

| Issue | Impact |
|-------|--------|
| Auto-compact randomly triggers | Loses context mid-task |
| Session restarts lose everything | Have to re-explain project |
| No persistent memory | Each session starts fresh |
| Progress not tracked | Don't know what's done |

## 8.2 The Solution: Ralph Loop + Claude-Mem

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  Claude-Mem │    │ Ralph Loop  │    │ File System │    │
│  │             │    │             │    │             │    │
│  │ - Captures  │    │ - Continues │    │ - PRD.json  │    │
│  │   context   │◀──▶│   until     │◀──▶│ - progress  │    │
│  │ - Semantic  │    │   complete  │    │   .txt      │    │
│  │   search    │    │ - Feeds     │    │ - Git       │    │
│  │ - Survives  │    │   same      │    │   commits   │    │
│  │   restarts  │    │   prompt    │    │             │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
│  Together they provide:                                     │
│  ✅ Persistent memory across sessions                       │
│  ✅ Continuous autonomous operation                         │
│  ✅ Progress tracking that survives compaction              │
│  ✅ Semantic retrieval of relevant past work                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 8.3 Installation

```bash
# Step 1: Install claude-mem
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem

# Step 2: Install ralph-wiggum
/plugin marketplace add anthropics/claude-code
/plugin install ralph-wiggum@claude-plugins-official

# Step 3: Restart Claude Code
# Claude-mem will auto-start and begin capturing
```

## 8.4 Running the Autonomous Build

```bash
# In Claude Code, after plugins installed:

/ralph-loop "Build JUDGE app feature by feature following PRD.json.

WORKFLOW:
1. Read PRD.json - find first feature where passes=false
2. Build ONLY that feature
3. Run: cd app && npm run build
4. If build fails, fix errors and retry (max 3 attempts)
5. If build passes, update PRD.json: passes=true
6. Git commit: git add -A && git commit -m 'feat: [feature name]'
7. Append to progress.txt: [date] Completed: [feature name]
8. Move to next feature

IMPORTANT:
- Work on ONE feature at a time
- Always run npm run build before marking complete
- Always commit after each feature
- Use anti-sycophancy approach for verdict generation

OUTPUT when ALL features complete:
<promise>COMPLETE</promise>

OUTPUT if stuck after 3 attempts on same error:
BLOCKED: [describe the issue]" --max-iterations 50 --completion-promise "COMPLETE"
```

## 8.5 Monitoring Progress

While ralph loop runs:
- Check `progress.txt` for completed features
- Check `PRD.json` for `passes: true/false`
- Check git log for commits
- Visit `localhost:37777` for claude-mem web UI

## 8.6 If It Gets Stuck

1. Check the `BLOCKED:` message
2. Fix the issue manually
3. Run `/cancel-ralph` to stop current loop
4. Restart with same command

---

<a name="part-9-slang-terminology"></a>
# PART 9: SLANG & TERMINOLOGY

## 9.1 Tier System

### Tier 1: Universal (Everyone Knows) ✅ Use Freely

| Term | Meaning | Example Verdict Usage |
|------|---------|----------------------|
| **Red flag** 🚩 | Warning sign | "The court identifies 3 major red flags" |
| **Green flag** 🟢 | Positive sign | "Green flag: Party A apologized first" |
| **Gaslighting** | Making someone doubt reality | "Party B is actively gaslighting Party A" |
| **Toxic** | Unhealthy behavior | "Toxic communication patterns detected" |
| **The ick** | Sudden turn-off | "That passive-aggressive text gave the ick" |
| **Sus** | Suspicious (from Among Us) | "That excuse is mad sus" |
| **Valid** | Acceptable, makes sense | "Party A's concerns are valid" |
| **No cap** | No lie, for real | "No cap, Party B fumbled this hard" |

### Tier 2: Widely Known ⚠️ Use Sparingly

| Term | Meaning | Example Verdict Usage |
|------|---------|----------------------|
| **Ate** | Did exceptionally well | "Party A ate with that response" |
| **Ate and left no crumbs** | Absolutely perfect execution | "That apology ate and left no crumbs" |
| **Slay** | Killed it, did great | "Party B slayed the communication" |
| **Cooked** | In trouble / destroyed | "After that screenshot, Party A is cooked" |
| **Delulu** | Delusional | "Party B is being delulu about this" |
| **Love bombing** | Excessive early affection | "Classic love bombing pattern in Exhibit C" |
| **Stonewalling** | Refusing to communicate | "Party A is stonewalling instead of discussing" |
| **Manipulative** | Using tactics to control | "Manipulative behavior evident throughout" |

### Tier 3: Too Niche ❌ Avoid

| Term | Why Avoid |
|------|-----------|
| Groundhogging | Requires explanation, not self-evident |
| Cushioning | Too niche, dating-specific |
| 67 / 6-7 | Brain-rot humor, meaningless |
| Clanker | AI slur, weird for an AI app to use |
| Demure | Already fading, overused |
| Rizz | Overused to the point of cringe |

## 9.2 Manipulation Tactics to Detect

| Tactic | Description | Signs |
|--------|-------------|-------|
| **Gaslighting** | Making victim doubt their reality | "That never happened", "You're imagining things" |
| **DARVO** | Deny, Attack, Reverse Victim and Offender | Immediate counterattack when confronted |
| **Stonewalling** | Refusing to engage | One-word answers, leaving conversations |
| **Love bombing** | Excessive affection early | Overwhelming compliments, gifts, attention |
| **Guilt-tripping** | Using guilt to manipulate | "After everything I've done for you..." |
| **Deflection** | Changing subject to avoid accountability | "What about that time YOU..." |

## 9.3 Red Flags to Look For

| Category | Examples |
|----------|----------|
| **Communication** | Never apologizes, always deflects blame |
| **Respect** | Dismisses feelings, interrupts constantly |
| **Boundaries** | Ignores "no", pushes past limits |
| **Consistency** | Stories change, facts don't add up |
| **Emotional** | Hot/cold behavior, unpredictable reactions |

## 9.4 Example Verdict Voice

**Bad (Too Professional):**
> "The evidence suggests that the respondent exhibited problematic communication patterns that may indicate a lack of emotional maturity."

**Good (JUDGE Voice):**
> "Party B is cooked, no cap. The court found 4 red flags including classic gaslighting ('I never said that' when Exhibit A literally shows they said that) and some major ick-inducing passive-aggression. Party A ate and left no crumbs with their calm response. Verdict: Party A wins."

---

<a name="part-10-design-system"></a>
# PART 10: DESIGN SYSTEM

## 10.1 Color Palette

| Name | Hex | RGB | CSS Variable | Usage |
|------|-----|-----|--------------|-------|
| **Black** | `#000000` | 0, 0, 0 | `--color-judge-black` | All backgrounds |
| **White** | `#FFFFFF` | 255, 255, 255 | `--color-judge-white` | Body text |
| **Gold** | `#D4A843` | 212, 168, 67 | `--color-judge-gold` | Winners, headers, CTAs |
| **Red** | `#FF3B3B` | 255, 59, 59 | `--color-judge-red` | Toxicity, warnings, red flags |
| **Purple** | `#8B5CF6` | 139, 92, 246 | `--color-judge-purple` | Secondary accents |

## 10.2 Typography

| Element | Font | Weight | Size | Tracking | Transform |
|---------|------|--------|------|----------|-----------|
| Hero header | Inter | 700 | 6xl (60px) | ultrawide (0.25em) | UPPERCASE |
| Section header | Inter | 700 | 3xl (30px) | widest (0.1em) | UPPERCASE |
| Body text | Inter | 400 | base (16px) | normal | normal |
| Small text | Inter | 400 | sm (14px) | wide (0.05em) | normal |
| Button text | Inter | 700 | lg (18px) | wider (0.05em) | UPPERCASE |

## 10.3 Spacing

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Between related elements |
| md | 16px | Standard spacing |
| lg | 24px | Section separation |
| xl | 32px | Major sections |
| 2xl | 48px | Page sections |

## 10.4 Visual Vibe

**Description:** "Law & Order meets Nuremberg trials aesthetic"

**Characteristics:**
- Dark, weighty, consequential
- Official and authoritative
- Stark contrast (black + white + accent)
- No emojis in UI (except 🚩 for red flags)
- Clean, uncluttered layouts
- Dramatic animations on key moments

## 10.5 Animation Principles

| Moment | Animation Style | Duration |
|--------|-----------------|----------|
| Page enter | Fade up + scale | 0.6s |
| Verdict reveal | Delay → spring bounce | 0.8s + 2s delay |
| Button hover | Fade fill | 0.3s |
| Loading states | Gentle pulse | Continuous |
| Success | Celebratory bounce | 0.5s |

---

<a name="part-11-technical-architecture"></a>
# PART 11: TECHNICAL ARCHITECTURE

## 11.1 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **UI Framework** | React | 18.x | Component-based UI |
| **Build Tool** | Vite | 7.3.x | Fast dev server, builds |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | TailwindCSS | 4.x | Utility-first CSS |
| **Animation** | Motion | 11.x | React animations |
| **AI** | Gemini API | 3 Pro | OCR + verdict generation |
| **Storage** | IndexedDB | Native | Local case history |
| **Image Gen** | html-to-image | Latest | Shareable cards |

## 11.2 API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │  Upload     │   │   Gemini    │   │   Verdict   │      │
│  │  Component  │──▶│   Service   │──▶│  Component  │      │
│  └─────────────┘   └──────┬──────┘   └─────────────┘      │
│                           │                                 │
│                           ▼                                 │
│                    ┌─────────────┐                         │
│                    │  IndexedDB  │                         │
│                    │   Service   │                         │
│                    └─────────────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    GEMINI API (External)                    │
│                                                             │
│  ┌─────────────────┐      ┌─────────────────┐              │
│  │ Gemini 2.5 Flash│      │ Gemini 3 Pro    │              │
│  │ (OCR - fast)    │      │ (Verdicts)      │              │
│  └─────────────────┘      └─────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 11.3 Gemini API Usage

### OCR (Screenshot → Text)

```typescript
// Use Gemini 2.5 Flash for speed + cost
const extractText = async (imageBase64: string): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Extract all text from this conversation screenshot.
                     Preserve speaker names/labels and message order.
                     Format as: [Speaker]: Message`
            },
            {
              inline_data: {
                mime_type: "image/png",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1, // Low for accuracy
        }
      })
    }
  );
  return response.json();
};
```

### Verdict Generation

```typescript
// Use Gemini 3 Pro for reasoning
const generateVerdict = async (
  conversation: string,
  partyA: string,
  partyB: string,
  context?: string
): Promise<Verdict> => {
  const systemPrompt = `You are JUDGE, a brutally honest courtroom AI.

CRITICAL: Do NOT be sycophantic. Users want genuine verdicts, not validation.

Analyze this conversation between ${partyA} (Party A) and ${partyB} (Party B).

Use these terms naturally: red flag, green flag, gaslighting, toxic, the ick, sus, valid, no cap, ate, slay, cooked.

Respond with this exact JSON structure:
{
  "winner": "Party A" | "Party B" | "Draw",
  "winner_reason": "1-2 sentences using slang",
  "credibility": { "partyA": 0-100, "partyB": 0-100 },
  "toxicity": 0-100,
  "manipulation_tactics": [...],
  "red_flags": [...],
  "evidence_log": [...],
  "judges_opinion": "2-3 paragraphs, legal style but accessible",
  "recommendations": { "partyA": "advice", "partyB": "advice" }
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nConversation:\n${conversation}\n\nContext: ${context || 'None provided'}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    }
  );
  return response.json();
};
```

## 11.4 IndexedDB Schema

```typescript
interface Case {
  id: string;              // UUID
  createdAt: Date;
  partyA: string;
  partyB: string;
  evidenceType: 'screenshots' | 'text';
  conversation: string;    // Extracted/pasted text
  context?: string;
  verdict: Verdict;
  screenshots?: string[];  // Base64 (optional, for re-viewing)
}

// Database setup
const db = await openDB('judge-app', 1, {
  upgrade(db) {
    const store = db.createObjectStore('cases', { keyPath: 'id' });
    store.createIndex('createdAt', 'createdAt');
    store.createIndex('winner', 'verdict.winner');
  }
});
```

## 11.5 File Structure (Target)

```
judge-app/
├── app/
│   ├── src/
│   │   ├── main.tsx              # Entry point
│   │   ├── App.tsx               # Router + layout
│   │   ├── index.css             # Tailwind @theme + globals
│   │   │
│   │   ├── screens/              # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Upload.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── Deliberation.tsx
│   │   │   ├── Verdict.tsx
│   │   │   ├── ShareCard.tsx
│   │   │   ├── History.tsx
│   │   │   └── Settings.tsx
│   │   │
│   │   ├── components/           # Reusable UI
│   │   │   ├── Button.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ExhibitGrid.tsx
│   │   │   ├── CredibilityBar.tsx
│   │   │   ├── ToxicityMeter.tsx
│   │   │   └── VerdictCard.tsx
│   │   │
│   │   ├── services/             # Business logic
│   │   │   ├── gemini.ts         # API calls
│   │   │   ├── db.ts             # IndexedDB
│   │   │   └── share.ts          # Web Share API
│   │   │
│   │   ├── types/                # TypeScript types
│   │   │   └── verdict.ts
│   │   │
│   │   └── assets/
│   │       └── sounds/
│   │           └── gavel.mp3
│   │
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── .env                      # VITE_GEMINI_API_KEY
│   └── package.json
│
├── PRD.json                      # Feature checklist
├── CLAUDE.md                     # Build instructions (<100 lines)
├── progress.txt                  # Append-only log
└── run.ps1                       # Single launcher
```

---

<a name="part-12-monetization"></a>
# PART 12: MONETIZATION

## 12.1 Strategy: Freemium + Credits

Based on RevenueCat 2025 trends:

> "For AI-driven apps, expect usage-based monetization to become dominant"

## 12.2 Tier Structure

| Tier | Price | Credits | Features |
|------|-------|---------|----------|
| **Free** | $0 | 3 verdicts/day | Basic cards, watermark |
| **Plus** | $4.99/mo | 50 verdicts/mo | Premium cards, no watermark |
| **Pro** | $9.99/mo | Unlimited | All themes, priority processing |

## 12.3 Additional Revenue Streams

| Stream | Price | Description |
|--------|-------|-------------|
| Card themes | $0.99-2.99 | One-time purchase for premium themes |
| Remove watermark | $1.99 | One-time purchase |
| Case packs | $0.99/10 | Buy additional verdicts |

## 12.4 Cost Analysis

| Users/Day | Daily Verdicts | API Cost | Potential Revenue |
|-----------|----------------|----------|-------------------|
| 100 | 300 | ~$6/day | - |
| 1,000 | 3,000 | ~$60/day | $150-500/day (5% conversion) |
| 10,000 | 30,000 | ~$600/day | $1,500-5,000/day |

## 12.5 Conversion Benchmarks

| Metric | Industry Average | Target |
|--------|------------------|--------|
| Free → Paid | 2-5% | 5% |
| D7 Retention | 15-20% | 25% |
| D30 Retention | 5-10% | 15% |

---

<a name="part-13-virality"></a>
# PART 13: VIRALITY - Growth Strategy

## 13.1 Viral Mechanics

| Mechanic | Implementation | K-Factor Impact |
|----------|----------------|-----------------|
| **Shareable cards** | Download/share verdict images | High |
| **Controversy** | Honest (sometimes harsh) verdicts | High |
| **Social proof** | "The AI agrees with me" | Medium |
| **Voyeurism** | Browse others' anonymous cases | Medium |
| **TikTok potential** | "Let's see what JUDGE says" videos | Very High |

## 13.2 Viral Loop

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐│
│    │ User  │────▶│ Gets  │────▶│Shares │────▶│Friend ││
│    │ Uses  │     │Verdict│     │ Card  │     │ Sees  ││
│    │ App   │     │       │     │       │     │       ││
│    └───────┘     └───────┘     └───────┘     └───┬───┘│
│         ▲                                        │     │
│         │                                        │     │
│         └────────────────────────────────────────┘     │
│                    Uses App                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 13.3 TikTok Strategy

**Content Format:**
1. "Let's see what AI thinks about my relationship" - Submit conversation
2. "The judge is deliberating..." - Build suspense
3. "OMG the verdict" - React to result
4. Show verdict card

**Hashtags:**
- #JUDGE
- #AIJudge
- #RelationshipAdvice
- #AmITheAsshole
- #WhoIsWrong

## 13.4 Launch Strategy

| Phase | Action | Timeline |
|-------|--------|----------|
| 1. Soft launch | Friends & family testing | Week 1 |
| 2. Reddit | Post in r/relationships, r/AITA | Week 2 |
| 3. TikTok | Create 3-5 example videos | Week 2-3 |
| 4. Product Hunt | Launch day | Week 4 |
| 5. Press | Tech blogs, lifestyle sites | Week 4+ |

---

<a name="part-14-file-by-file"></a>
# PART 14: FILE-BY-FILE CHANGES

## 14.1 Files to DELETE

| File | Reason |
|------|--------|
| `app/tailwind.config.js` | v4 ignores this, use @theme |
| `app/src/components/` | Empty folder |
| `app/src/pages/` | Empty folder |
| `app/src/hooks/` | Empty folder |
| `app/src/services/` | Empty folder |
| `app/src/types/` | Empty folder |
| `app/src/utils/` | Empty folder |
| `BUILD.cmd` | Redundant launcher |
| `BUILD-AUTO.cmd` | Redundant launcher |
| `start-claude.ps1` | Redundant launcher |
| `LOOP-INSTRUCTIONS.md` | Merge into CLAUDE.md |
| `SESSION-CONTEXT-FULL.md` | No longer needed |

## 14.2 Files to CREATE

| File | Purpose |
|------|---------|
| `progress.txt` | Append-only log for ralph loop |
| `run.ps1` | Single consolidated launcher |
| `app/src/screens/` | Folder for page components (when needed) |

## 14.3 Files to MODIFY

### `app/src/index.css`

**Current:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**New:**
```css
@import "tailwindcss";

@theme {
  --color-judge-black: #000000;
  --color-judge-white: #FFFFFF;
  --color-judge-red: #FF3B3B;
  --color-judge-gold: #D4A843;
  --color-judge-purple: #8B5CF6;

  --letter-spacing-ultrawide: 0.25em;
}

body {
  background-color: var(--color-judge-black);
  color: var(--color-judge-white);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### `CLAUDE.md`

Replace 4600+ character file with <100 line version (see Part 7.2)

### `.claude/memory/session_20260108_judge_app.md`

Already updated to point to project folder.

---

<a name="part-15-action-plan"></a>
# PART 15: ACTION PLAN

## 15.1 Immediate Actions (Before Building)

| # | Task | Time | Command/Action |
|---|------|------|----------------|
| 1 | Delete tailwind.config.js | 1 min | `rm app/tailwind.config.js` |
| 2 | Update index.css with @theme | 2 min | See Part 7.1 |
| 3 | Delete empty folders | 1 min | `rm -r app/src/{components,pages,hooks,services,types,utils}` |
| 4 | Delete redundant launchers | 1 min | `rm BUILD.cmd BUILD-AUTO.cmd start-claude.ps1` |
| 5 | Delete SESSION-CONTEXT-FULL.md | 1 min | `rm SESSION-CONTEXT-FULL.md` |
| 6 | Merge LOOP-INSTRUCTIONS into CLAUDE.md | 5 min | See Part 7.2 |
| 7 | Create progress.txt | 1 min | See Part 7.3 |
| 8 | Create run.ps1 | 2 min | See Part 7.4 |
| 9 | Install claude-mem plugin | 2 min | `/plugin install claude-mem` |
| 10 | Install ralph-wiggum plugin | 2 min | `/plugin install ralph-wiggum` |

**Total: ~18 minutes**

## 15.2 Build Phase (Ralph Loop)

After setup, run:

```bash
/ralph-loop "Build JUDGE app feature by feature following PRD.json..." --max-iterations 50 --completion-promise "COMPLETE"
```

Expected runtime: 2-6 hours depending on complexity and iterations needed.

## 15.3 Post-Build

| Task | Priority |
|------|----------|
| Test all features manually | High |
| Fix any bugs from ralph loop | High |
| Add sound effects | Medium |
| Create launch graphics | Medium |
| Write Product Hunt copy | Medium |
| Record demo video | Medium |

## 15.4 Launch Checklist

- [ ] All 11 PRD features pass
- [ ] Gemini API works in production
- [ ] Shareable cards generate correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Favicon and meta tags
- [ ] Analytics (optional)
- [ ] Domain configured (optional)

---

# APPENDIX: QUICK REFERENCE

## Colors
```css
--color-judge-black: #000000
--color-judge-white: #FFFFFF
--color-judge-gold: #D4A843
--color-judge-red: #FF3B3B
--color-judge-purple: #8B5CF6
```

## Commands
```bash
cd app && npm run dev     # Dev server
cd app && npm run build   # Build
.\run.ps1 -Auto           # Autonomous mode
/ralph-loop "..."         # Start loop
/cancel-ralph             # Stop loop
```

## Key Files
```
PRD.json        # Feature status
progress.txt    # Append-only log
CLAUDE.md       # Build instructions
app/.env        # API key
```

## Slang Cheat Sheet
```
Tier 1: red flag, green flag, gaslighting, toxic, ick, sus, valid, no cap
Tier 2: ate, slay, cooked, delulu, love bombing, stonewalling
Avoid: groundhogging, cushioning, 67, clanker, demure
```

---

# RESEARCH SOURCES

## Viral AI Apps & Strategy
- a16z State of Consumer AI 2025: https://a16z.com/state-of-consumer-ai-2025-product-hits-misses-and-whats-next/
- Superwall Viral App Guide: https://superwall.com/blog/how-to-ideate-a-viral-app-in-2025

## Ralph Loop & Autonomous Coding
- Official Ralph Wiggum Plugin: https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum
- Matt Pocock on X: https://x.com/mattpocockuk/status/2007924876548637089
- Paddo.dev Guide: https://paddo.dev/blog/ralph-wiggum-autonomous-loops/

## Claude-Mem & Context Persistence
- GitHub claude-mem: https://github.com/thedotmack/claude-mem
- Context Loss Issue: https://github.com/anthropics/claude-code/issues/13112

## Tailwind CSS v4
- Custom Colors Discussion: https://github.com/tailwindlabs/tailwindcss/discussions/16338

## Shareable Cards
- html-to-image vs html2canvas: https://npm-compare.com/dom-to-image,html-to-image,html2canvas

## AI Sycophancy Research
- MIT Technology Review: https://www.technologyreview.com/2025/05/30/1117551/this-benchmark-used-reddits-aita-to-test-how-much-ai-models-suck-up-to-us/

## React Project Structure
- Robin Wieruch Guide: https://www.robinwieruch.de/react-folder-structure/

## Animation Libraries
- Motion (Framer): https://motion.dev/
- Semaphore Comparison: https://semaphore.io/blog/react-framer-motion-gsap

## Gemini API
- Pricing: https://ai.google.dev/gemini-api/docs/pricing
- OCR Best Practices: https://blog.roboflow.com/how-to-use-gemini-for-ocr/

## Gen-Z Slang
- Wikipedia Glossary: https://en.wikipedia.org/wiki/Glossary_of_2020s_slang
- Gabb Teen Slang 2026: https://gabb.com/blog/teen-slang/
- XNSPY Guide: https://xnspy.com/blog/gen-z-slang-words.html

## Monetization
- RevenueCat 2025 Trends: https://www.revenuecat.com/blog/growth/2025-app-monetization-trends/

## PWA & Web Share API
- MDN Web Share: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Share_data_between_apps

## Competitor Apps
- AI Judge: https://aijudge.vercel.app/
- You're Wrong: https://www.yourewrong.app/
- AreYouTheAsshole: https://areyoutheasshole.com/
- Goblin Tools Judge: https://goblin.tools/Judge

---

**END OF HYPER-DETAILED MASTER RECAP**

*Document generated: 2026-01-08*
*Total: ~15,000 words*
