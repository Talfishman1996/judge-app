// Gemini API Service for JUDGE App

export interface VerdictResponse {
  winner: 'Party A' | 'Party B' | 'Draw'
  winner_reason: string
  credibility: {
    partyA: number
    partyB: number
  }
  toxicity: number
  manipulation_tactics: Array<{
    name: string
    evidence: string
    severity: 'high' | 'medium' | 'low'
  }>
  red_flags: Array<{
    flag: string
    party: 'A' | 'B'
    evidence: string
  }>
  evidence_log: Array<{
    exhibit: string
    summary: string
    favors: 'Party A' | 'Party B' | 'Neither'
  }>
  judges_opinion: string
  recommendations: {
    partyA: string
    partyB: string
  }
}

export interface TextEvidence {
  type: 'text'
  conversation: string
  partyA: string
  partyB: string
  context?: string
}

export interface ScreenshotEvidence {
  type: 'screenshots'
  exhibits: Array<{
    label: string
    data: string // base64
    type: string
  }>
}

export type Evidence = TextEvidence | ScreenshotEvidence

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

const VERDICT_PROMPT = `Analyze the following evidence and deliver your verdict.

You must respond with ONLY valid JSON matching this exact structure:
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

function getApiKey(): string {
  // Hardcoded API key - creator foots the bill
  return 'AIzaSyAAFMVltRc4lu1uAfCcNG1ZLtefWC5noQU'
}

export async function analyzeEvidence(evidence: Evidence): Promise<VerdictResponse> {
  const apiKey = getApiKey()

  let userContent: string

  if (evidence.type === 'text') {
    userContent = `CASE DETAILS:
Party A: ${evidence.partyA}
Party B: ${evidence.partyB}
${evidence.context ? `Context: ${evidence.context}` : ''}

THE CONVERSATION:
${evidence.conversation}`
  } else {
    // For screenshots, we'll use Gemini's vision capability
    userContent = `CASE DETAILS:
Analyze the following ${evidence.exhibits.length} screenshot(s) submitted as evidence.
Extract the conversation, identify the parties, and deliver your verdict.`
  }

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: evidence.type === 'screenshots'
          ? [
              { text: userContent },
              ...evidence.exhibits.map(ex => ({
                inline_data: {
                  mime_type: ex.type,
                  data: ex.data.replace(/^data:image\/\w+;base64,/, '')
                }
              }))
            ]
          : [{ text: userContent }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    }
  }

  // Use Gemini 3 Flash for fast, decisive, savage verdicts
  const model = 'gemini-3-flash-preview'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Gemini API error:', error)
    throw new Error(error.error?.message || 'Failed to analyze evidence')
  }

  const data = await response.json()

  // Extract the text from Gemini's response
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!responseText) {
    throw new Error('No response from Gemini API')
  }

  // Parse the JSON response
  try {
    const verdict = JSON.parse(responseText) as VerdictResponse
    return verdict
  } catch {
    console.error('Failed to parse verdict JSON:', responseText)
    throw new Error('Failed to parse verdict response')
  }
}

// Check if test mode is enabled
function isTestMode(): boolean {
  return localStorage.getItem('testMode') === 'true'
}

// Mock verdict for testing without API calls
function getMockVerdict(evidence: Evidence): VerdictResponse {
  const partyA = evidence.type === 'text' ? evidence.partyA : 'Person A'
  const partyB = evidence.type === 'text' ? evidence.partyB : 'Person B'

  // Randomize values for realistic testing
  const partyACredibility = Math.floor(Math.random() * 40) + 60 // 60-99
  const partyBCredibility = Math.floor(Math.random() * 40) + 10 // 10-49
  const toxicity = Math.floor(Math.random() * 50) + 30 // 30-79

  return {
    winner: 'Party A',
    winner_reason: `${partyA} demonstrated more emotional maturity and logical consistency throughout the exchange.`,
    credibility: {
      partyA: partyACredibility,
      partyB: partyBCredibility
    },
    toxicity,
    manipulation_tactics: [
      { name: 'Gaslighting', evidence: 'You\'re overreacting', severity: 'high' },
      { name: 'DARVO', evidence: 'Deflected blame back onto the other party', severity: 'medium' },
      { name: 'Guilt-tripping', evidence: 'After everything I\'ve done', severity: 'medium' }
    ],
    red_flags: [
      { flag: 'Main Character Syndrome', party: 'B', evidence: 'Made everything about themselves' },
      { flag: 'Emotional Invalidation', party: 'B', evidence: 'Dismissed partner\'s concerns' },
      { flag: 'Deflection', party: 'B', evidence: 'Changed subject when confronted' }
    ],
    evidence_log: [
      { exhibit: 'A', summary: 'Initial complaint was reasonable and clearly stated', favors: 'Party A' },
      { exhibit: 'B', summary: 'Response showed defensive behavior', favors: 'Party A' },
      { exhibit: 'C', summary: 'Escalation came from the defendant', favors: 'Party A' }
    ],
    judges_opinion: `After careful review of the evidence, this court finds in favor of ${partyA}. The exchange clearly demonstrates a pattern of dismissive and manipulative behavior from ${partyB}. When ${partyA} expressed legitimate concerns, they were met with deflection, blame-shifting, and emotional invalidation. This is textbook DARVO behavior.\n\nThe evidence shows ${partyA} maintained composure and articulated their position clearly, while ${partyB} resorted to manipulation tactics rather than addressing the core issues.\n\n[TEST MODE - This is mock data for UI testing]`,
    recommendations: {
      partyA: 'Trust your instincts. Your feelings are valid and you communicated them well.',
      partyB: 'Consider how your responses make others feel. Practice active listening instead of defending.'
    }
  }
}

// Add the verdict prompt to the request
export async function analyzeWithPrompt(evidence: Evidence): Promise<VerdictResponse> {
  // If test mode is enabled, return mock data without API call
  if (isTestMode()) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    return getMockVerdict(evidence)
  }
  const apiKey = getApiKey()

  let userContent: string

  if (evidence.type === 'text') {
    userContent = `${VERDICT_PROMPT}

CASE DETAILS:
Party A: ${evidence.partyA}
Party B: ${evidence.partyB}
${evidence.context ? `Context: ${evidence.context}` : ''}

THE CONVERSATION:
${evidence.conversation}`
  } else {
    userContent = `${VERDICT_PROMPT}

CASE DETAILS:
Analyze the following ${evidence.exhibits.length} screenshot(s) submitted as evidence.
Extract the conversation, identify the parties, and deliver your verdict.`
  }

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: evidence.type === 'screenshots'
          ? [
              { text: userContent },
              ...evidence.exhibits.map(ex => ({
                inline_data: {
                  mime_type: ex.type,
                  data: ex.data.replace(/^data:image\/\w+;base64,/, '')
                }
              }))
            ]
          : [{ text: userContent }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096
    }
  }

  // Use Gemini 3 Flash for fast, decisive, savage verdicts
  const model = 'gemini-3-flash-preview'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Gemini API error:', error)
    throw new Error(error.error?.message || 'Failed to analyze evidence')
  }

  const data = await response.json()
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!responseText) {
    throw new Error('No response from Gemini API')
  }

  // Try to extract JSON from the response (in case there's extra text)
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('No JSON found in response:', responseText)
    throw new Error('Invalid response format from Gemini')
  }

  try {
    const verdict = JSON.parse(jsonMatch[0]) as VerdictResponse
    return verdict
  } catch {
    console.error('Failed to parse verdict JSON:', jsonMatch[0])
    throw new Error('Failed to parse verdict response')
  }
}
