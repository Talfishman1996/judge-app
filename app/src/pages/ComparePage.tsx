import { useEffect } from 'react'

export default function ComparePage() {
  useEffect(() => {
    // Inject mock data
    const mockVerdict = {
      winner: "Party A",
      winner_reason: "Analysis indicates logical consistency and emotional stability in Sophia's statements.",
      credibility: { partyA: 92, partyB: 34 },
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

    localStorage.setItem('verdict', JSON.stringify(mockVerdict))
    localStorage.setItem('evidence', JSON.stringify(mockEvidence))
  }, [])

  return (
    <div className="min-h-screen bg-neutral-900 p-4">
      <h1 className="text-white text-center text-xl font-bold mb-4">iPhone Comparison</h1>
      <div className="flex gap-4 justify-center flex-wrap">
        {/* Original */}
        <div className="text-center">
          <h2 className="text-white text-sm font-bold mb-2">ORIGINAL (Scroll)</h2>
          <div className="w-[390px] h-[844px] border-[8px] border-neutral-700 rounded-[50px] overflow-hidden bg-black">
            <iframe
              src="/verdict"
              className="w-full h-full border-0"
              title="Original Verdict"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="text-center">
          <h2 className="text-white text-sm font-bold mb-2">SUMMARY</h2>
          <div className="w-[390px] h-[844px] border-[8px] border-neutral-700 rounded-[50px] overflow-hidden bg-black">
            <iframe
              src="/verdict/summary"
              className="w-full h-full border-0"
              title="Summary Verdict"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
