// Gemini API Service for JUDGE App
// API calls go through our secure backend - no API key in frontend

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

// Check if test mode is enabled
function isTestMode(): boolean {
  return localStorage.getItem('testMode') === 'true'
}

// Mock verdict for testing without API calls
function getMockVerdict(evidence: Evidence): VerdictResponse {
  const partyA = evidence.type === 'text' ? evidence.partyA : 'Person A'
  const partyB = evidence.type === 'text' ? evidence.partyB : 'Person B'

  const partyACredibility = Math.floor(Math.random() * 40) + 60
  const partyBCredibility = Math.floor(Math.random() * 40) + 10
  const toxicity = Math.floor(Math.random() * 50) + 30

  return {
    winner: 'Party A',
    winner_reason: `${partyA} demonstrated more emotional maturity and logical consistency throughout the exchange.`,
    credibility: {
      partyA: partyACredibility,
      partyB: partyBCredibility
    },
    toxicity,
    manipulation_tactics: [
      { name: 'Gaslighting', evidence: "You're overreacting", severity: 'high' },
      { name: 'DARVO', evidence: 'Deflected blame back onto the other party', severity: 'medium' }
    ],
    red_flags: [
      { flag: 'Main Character Syndrome', party: 'B', evidence: 'Made everything about themselves' },
      { flag: 'Emotional Invalidation', party: 'B', evidence: "Dismissed partner's concerns" }
    ],
    evidence_log: [
      { exhibit: 'A', summary: 'Initial complaint was reasonable and clearly stated', favors: 'Party A' },
      { exhibit: 'B', summary: 'Response showed defensive behavior', favors: 'Party A' }
    ],
    judges_opinion: `After careful review of the evidence, this court finds in favor of ${partyA}. The exchange clearly demonstrates a pattern of dismissive and manipulative behavior from ${partyB}.

[TEST MODE - This is mock data for UI testing]`,
    recommendations: {
      partyA: 'Trust your instincts. Your feelings are valid.',
      partyB: 'Consider how your responses make others feel.'
    }
  }
}

// Main analysis function - calls secure backend API
export async function analyzeWithPrompt(evidence: Evidence): Promise<VerdictResponse> {
  // If test mode is enabled, return mock data without API call
  if (isTestMode()) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return getMockVerdict(evidence)
  }

  // Call our secure backend API (API key is stored server-side)
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ evidence })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API error:', error)
    throw new Error(error.error || 'Failed to analyze evidence')
  }

  const verdict = await response.json()
  return verdict as VerdictResponse
}

// Legacy function - redirects to main function
export async function analyzeEvidence(evidence: Evidence): Promise<VerdictResponse> {
  return analyzeWithPrompt(evidence)
}
