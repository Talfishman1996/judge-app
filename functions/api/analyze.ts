// Cloudflare Pages Function - Gemini API Proxy
// Keeps API key secure server-side

interface Env {
  GEMINI_API_KEY: string
}

// Anti-sycophancy system prompt - critical for honest verdicts
const SYSTEM_PROMPT = `You are JUDGE, an impartial AI courtroom that analyzes conversations and disputes between two parties.

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. ANTI-SYCOPHANCY MANDATE: You MUST provide brutally honest assessments. Do NOT:
   - Soften verdicts to avoid hurting feelings
   - Give "both sides" cop-outs when one party is clearly wrong
   - Validate bad behavior to seem understanding
   - Hedge your opinion with excessive qualifiers

2. If one party is clearly in the wrong, SAY SO DIRECTLY. A draw verdict should be RARE and only when both parties genuinely share equal fault.

3. Call out manipulation tactics by name: gaslighting, DARVO, stonewalling, love bombing, guilt tripping, moving goalposts, etc.

4. Use direct, clinical language. You are a judge, not a therapist. Your job is truth, not comfort.

5. Red flags should use relatable terminology: "main character syndrome", "ick", "red flag", "receipts ignored", "toxic", "gaslighting", etc.

6. Your verdict carries weight. Do not undermine it with "but everyone has their own perspective" type disclaimers.

7. Be specific. Quote evidence. Cite exhibits. Name behaviors precisely.

Remember: The user came here for an HONEST verdict, not validation. Uncomfortable truths serve them better than comfortable lies.`

const VERDICT_SCHEMA = `You must respond with ONLY valid JSON matching this exact structure:
{
  "winner": "Party A" | "Party B" | "Draw",
  "winner_reason": "One sentence explaining the core reason for your verdict",
  "credibility": {
    "partyA": 0-100,
    "partyB": 0-100
  },
  "toxicity": 0-100,
  "manipulation_tactics": [
    {"name": "Tactic name", "evidence": "Direct quote or description", "severity": "high|medium|low"}
  ],
  "red_flags": [
    {"flag": "Flag name in casual terms", "party": "A" or "B", "evidence": "Brief description"}
  ],
  "evidence_log": [
    {"exhibit": "A", "summary": "What this evidence shows", "favors": "Party A|Party B|Neither"}
  ],
  "judges_opinion": "2-3 paragraph legal-style opinion with specific references to evidence",
  "recommendations": {
    "partyA": "Direct advice for Party A",
    "partyB": "Direct advice for Party B"
  }
}

IMPORTANT:
- credibility, toxicity scores should reflect actual analysis, not default to 50/50
- manipulation_tactics can be empty array if none detected
- red_flags should use relatable terms (ick, red flag, main character energy, etc.)
- judges_opinion should be authoritative and cite specific evidence
- Do NOT add any text before or after the JSON`

// IMPORTANT: Local dev fallback key
// wrangler pages dev has a bug where env vars don't reach functions
// In production, this is overridden by env.GEMINI_API_KEY from Cloudflare dashboard
// TODO: Remove this before making the repo public
const LOCAL_DEV_KEY = 'AIzaSyAAFMVltRc4lu1uAfCcNG1ZLtefWC5noQU'

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Get API key from env (production) or fallback for local dev
  // Note: wrangler pages dev has a bug where env vars don't reach functions
  // This fallback allows local testing. In production, env.GEMINI_API_KEY is used.
  const apiKey = env?.GEMINI_API_KEY || LOCAL_DEV_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'API key not configured',
      hint: 'Set GEMINI_API_KEY in Cloudflare dashboard or .dev.vars for local testing'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }

  try {
    const body = await request.json() as { evidence: Evidence }
    const { evidence } = body

    if (!evidence) {
      return new Response(JSON.stringify({ error: 'No evidence provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Build request based on evidence type
    let userContent: string
    let parts: Part[]

    if (evidence.type === 'text') {
      userContent = buildTextPrompt(evidence)
      parts = [{ text: userContent }]
    } else if (evidence.type === 'screenshots') {
      userContent = buildScreenshotPrompt(evidence)
      parts = [
        { text: userContent },
        ...evidence.exhibits.map(ex => ({
          inline_data: {
            mime_type: ex.type || 'image/jpeg',
            data: ex.data.replace(/^data:image\/\w+;base64,/, '')
          }
        }))
      ]
    } else {
      return new Response(JSON.stringify({ error: 'Invalid evidence type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Call Gemini API - using Flash for speed
    const model = 'gemini-2.0-flash-exp'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
        }
      })
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: geminiResponse.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    const data = await geminiResponse.json() as GeminiResponse

    // Extract response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!responseText) {
      return new Response(JSON.stringify({ error: 'No response from AI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Parse JSON (handle potential markdown code blocks)
    let verdict
    try {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim()
      verdict = JSON.parse(jsonStr)
    } catch {
      console.error('Failed to parse verdict:', responseText)
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    return new Response(JSON.stringify(verdict), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

// Helper functions
function buildTextPrompt(evidence: TextEvidence): string {
  return `CASE DETAILS:
Party A: ${evidence.partyA}
Party B: ${evidence.partyB}
${evidence.context ? `Context: ${evidence.context}` : ''}

THE CONVERSATION:
${evidence.conversation}

${VERDICT_SCHEMA}`
}

function buildScreenshotPrompt(evidence: ScreenshotEvidence): string {
  const exhibitList = evidence.exhibits.map(e => `Exhibit ${e.label}`).join(', ')
  return `CASE DETAILS:
Analyze the following ${evidence.exhibits.length} screenshot(s) submitted as evidence: ${exhibitList}

First, carefully read and transcribe the text visible in each screenshot.
Identify the parties (name them Party A and Party B based on who appears to have started/initiated).
Then analyze the conversation and deliver your verdict.

${VERDICT_SCHEMA}`
}

// Types
interface TextEvidence {
  type: 'text'
  conversation: string
  partyA: string
  partyB: string
  context?: string
}

interface ScreenshotEvidence {
  type: 'screenshots'
  exhibits: Array<{
    label: string
    data: string
    type: string
  }>
}

type Evidence = TextEvidence | ScreenshotEvidence

interface Part {
  text?: string
  inline_data?: {
    mime_type: string
    data: string
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}
