import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TestPage() {
  const navigate = useNavigate()
  const [testMode, setTestMode] = useState(false)

  useEffect(() => {
    setTestMode(localStorage.getItem('testMode') === 'true')
  }, [])

  const toggleTestMode = () => {
    const newValue = !testMode
    setTestMode(newValue)
    localStorage.setItem('testMode', newValue.toString())
  }

  const injectMockData = (route: string, loserCredibility = 34) => {
    const mockVerdict = {
      winner: "Party A",
      winner_reason: "Analysis indicates logical consistency and emotional stability in Sophia's statements.",
      credibility: { partyA: 92, partyB: loserCredibility },
      toxicity: 65,
      manipulation_tactics: [
        { name: "Gaslighting", evidence: "ur fine just sleep", severity: "high" },
        { name: "Guilt-tripping", evidence: "after everything I did for you", severity: "medium" }
      ],
      red_flags: [
        { flag: "Invalidating Feelings", party: "B", evidence: "dismissed concerns" },
        { flag: "Guilt-tripping", party: "B", evidence: "used past favors" },
        { flag: "Deflection", party: "B", evidence: "changed subject" }
      ],
      evidence_log: [
        { exhibit: "01", summary: "Subject dismissed partner's emotional state: \"ur fine just sleep\".", favors: "Party A" },
        { exhibit: "02", summary: "Escalation tactic observed: Accusation of \"ruining the vibe\".", favors: "Party A" },
        { exhibit: "03", summary: "Financial manipulation: Cited expenses to induce guilt.", favors: "Party A" }
      ],
      judges_opinion: "The court finds overwhelming evidence of emotional manipulation and invalidation by the Boyfriend. Sophia maintained composure and articulated her concerns clearly, while the Boyfriend exhibited classic DARVO behavior.",
      recommendations: {
        partyA: "Trust your instincts. Your feelings are valid.",
        partyB: "Seek to understand before seeking to be understood."
      }
    }

    const mockEvidence = { partyA: "Sophia", partyB: "Boyfriend" }

    sessionStorage.setItem('verdict', JSON.stringify(mockVerdict))
    sessionStorage.setItem('evidence', JSON.stringify(mockEvidence))
    localStorage.setItem('verdict', JSON.stringify(mockVerdict))
    localStorage.setItem('evidence', JSON.stringify(mockEvidence))

    navigate(route)
  }

  return (
    <div className="min-h-screen bg-judge-black p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Test Verdict Pages</h1>

      {/* Test Mode Toggle */}
      <div className="mb-6 p-4 rounded-xl border-2" style={{ borderColor: testMode ? '#22c55e' : '#ef4444', background: testMode ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-bold">Test Mode</div>
            <div className="text-white/60 text-sm">
              {testMode ? 'ON - Using mock data (unlimited testing)' : 'OFF - Using real Gemini API (has rate limits)'}
            </div>
          </div>
          <button
            onClick={toggleTestMode}
            className={`px-6 py-2 font-bold rounded-lg transition-all ${
              testMode
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {testMode ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => injectMockData('/verdict')}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
        >
          Open ORIGINAL (Scroll)
        </button>
        <button
          onClick={() => injectMockData('/verdict/summary')}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
        >
          Open SUMMARY
        </button>
        <button
          onClick={() => injectMockData('/verdict/story')}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold"
        >
          Open STORY
        </button>
        <button
          onClick={() => injectMockData('/verdict/carousel')}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold"
        >
          Open CAROUSEL
        </button>
        <button
          onClick={() => injectMockData('/verdict/tabloid')}
          className="w-full py-4 rounded-xl font-bold text-white"
          style={{ background: '#cc0000' }}
        >
          Open TABLOID (VS Style)
        </button>
        <button
          onClick={() => injectMockData('/verdict/brutalist')}
          className="w-full py-4 font-black text-black uppercase tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)'
          }}
        >
          Open BRUTALIST (NEW)
        </button>

        {/* Tier Testing - Select page then tier */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <h2 className="text-lg font-bold text-white mb-4">Test Meme Tiers (% Wrong)</h2>

          {/* All Verdict Pages */}
          <div className="space-y-4">
            {[
              { route: '/verdict', name: 'ORIGINAL', color: 'green' },
              { route: '/verdict/summary', name: 'SUMMARY', color: 'blue' },
              { route: '/verdict/story', name: 'STORY', color: 'purple' },
              { route: '/verdict/carousel', name: 'CAROUSEL', color: 'orange' },
              { route: '/verdict/tabloid', name: 'TABLOID', color: 'red' },
              { route: '/verdict/brutalist', name: 'BRUTALIST', color: 'yellow' },
            ].map((page) => (
              <div key={page.route}>
                <div className={`text-${page.color}-400 text-xs font-bold mb-2`}>{page.name}</div>
                <div className="grid grid-cols-4 gap-1">
                  <button onClick={() => injectMockData(page.route, 50)} className="py-1 bg-gray-600 text-white text-[10px] font-bold rounded">50%</button>
                  <button onClick={() => injectMockData(page.route, 42)} className="py-1 bg-yellow-700 text-white text-[10px] font-bold rounded">58%</button>
                  <button onClick={() => injectMockData(page.route, 32)} className="py-1 bg-orange-600 text-white text-[10px] font-bold rounded">68%</button>
                  <button onClick={() => injectMockData(page.route, 22)} className="py-1 bg-red-700 text-white text-[10px] font-bold rounded">78%</button>
                  <button onClick={() => injectMockData(page.route, 12)} className="py-1 bg-red-900 text-white text-[10px] font-bold rounded">88%</button>
                  <button onClick={() => injectMockData(page.route, 2)} className="py-1 bg-purple-900 text-white text-[10px] font-bold rounded">98%</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
