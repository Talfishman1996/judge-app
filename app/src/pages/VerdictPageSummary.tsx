import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { getShameData, getShameEmoji } from '../utils/shameTiers'

interface Verdict {
  winner: string
  winner_reason: string
  credibility: {
    partyA: number
    partyB: number
  }
  toxicity: number
  manipulation_tactics: Array<{
    name: string
    evidence: string
    severity: string
  }>
  red_flags: Array<{
    flag: string
    party: string
    evidence: string
  }>
  evidence_log: Array<{
    exhibit: string
    summary: string
    favors: string
  }>
  judges_opinion: string
  recommendations: {
    partyA: string
    partyB: string
  }
}

export default function VerdictPageSummary() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [caseNumber] = useState(() => `CASE-${Date.now().toString(36).toUpperCase()}`)
  const [shameImage, setShameImage] = useState<string>('')
  const [shameLabel, setShameLabel] = useState<string>('')
  const [wrongPercent, setWrongPercent] = useState(0)

  useEffect(() => {
    const verdictData = sessionStorage.getItem('verdict') || localStorage.getItem('verdict')
    if (!verdictData) {
      navigate('/')
      return
    }
    const parsedVerdict = JSON.parse(verdictData)
    setVerdict(parsedVerdict)

    // Calculate wrong percent and set shame data
    const loserCred = parsedVerdict.winner === 'Party A'
      ? parsedVerdict.credibility.partyB
      : parsedVerdict.credibility.partyA
    const calculatedWrongPercent = 100 - loserCred
    setWrongPercent(calculatedWrongPercent)

    const shameData = getShameData(calculatedWrongPercent)
    setShameImage(shameData.image)
    setShameLabel(shameData.label)
  }, [navigate])

  if (!verdict) return null

  const evidence = JSON.parse(sessionStorage.getItem('evidence') || localStorage.getItem('evidence') || '{}')
  const partyAName = evidence.partyA || 'Party A'
  const partyBName = evidence.partyB || 'Party B'

  const winnerName = verdict.winner === 'Party A' ? partyAName :
                     verdict.winner === 'Party B' ? partyBName : 'Draw'
  const loserName = verdict.winner === 'Party A' ? partyBName :
                    verdict.winner === 'Party B' ? partyAName : null
  const winnerCredibility = verdict.winner === 'Party A' ? verdict.credibility.partyA : verdict.credibility.partyB

  return (
    <div className="min-h-screen bg-judge-black p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!showDetails ? (
            // SUMMARY CARD VIEW
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* WINNER vs LOSER Side by Side */}
              <div className="grid grid-cols-5 gap-3">
                {/* Winner Card - Takes 3 columns, highlighted */}
                <div className="col-span-3 bg-gradient-to-br from-green-500/25 to-green-500/5 border-2 border-green-500/50 rounded-2xl p-4 relative overflow-hidden shadow-lg shadow-green-500/10">
                  {/* Crown */}
                  <div className="absolute -top-2 -right-2 text-green-400/20">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-green-400 text-xs font-bold tracking-[0.15em] mb-1">👑 WINNER</div>
                    <h2 className="text-4xl font-black text-white mb-2">{winnerName}</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-green-400 text-3xl font-bold">{winnerCredibility}%</span>
                      <span className="text-white/40 text-xs">credibility</span>
                    </div>
                  </div>
                </div>

                {/* Loser Card - Takes 2 columns, subdued */}
                {loserName && (
                  <div className="col-span-2 bg-gradient-to-br from-judge-red/15 to-judge-red/5 border border-judge-red/30 rounded-2xl p-4 relative overflow-hidden">
                    {/* Meme image */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-judge-red/30 mb-2">
                      <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 z-0">
                        <span className="text-xl opacity-50">{getShameEmoji(wrongPercent)}</span>
                      </div>
                      {shameImage && (
                        <img
                          src={shameImage}
                          alt="Reaction"
                          className="absolute inset-0 w-full h-full object-cover object-top z-10"
                          style={{ filter: 'grayscale(30%) contrast(1.1)' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                    </div>
                    <div className="relative z-10">
                      <div className="text-judge-red text-xs font-bold tracking-[0.1em] mb-1">{shameLabel}</div>
                      <h3 className="text-lg font-bold text-white/70 mb-1">{loserName}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-judge-red text-lg font-bold">{wrongPercent}%</span>
                        <span className="text-white/40 text-xs">wrong</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Winner's reasoning */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-white/60 text-sm">{verdict.winner_reason}</p>
              </div>

              {/* Toxicity meter */}
              <div className={`rounded-2xl p-4 ${
                verdict.toxicity >= 50
                  ? 'bg-judge-red/15 border border-judge-red/40'
                  : 'bg-white/5 border border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-bold tracking-wider ${
                      verdict.toxicity >= 50 ? 'text-judge-red' : 'text-white/40'
                    }`}>🔥 TOXICITY</div>
                    {verdict.toxicity >= 50 && (
                      <div className="text-judge-red text-xs mt-1">⚠️ Danger Zone</div>
                    )}
                  </div>
                  <div className={`font-black text-4xl ${
                    verdict.toxicity >= 50 ? 'text-judge-red' : 'text-white'
                  }`}>{verdict.toxicity}%</div>
                </div>
              </div>

              {/* Red Flags Preview */}
              {verdict.red_flags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {verdict.red_flags.slice(0, 3).map((flag, index) => (
                    <span
                      key={index}
                      className="bg-judge-red/10 border border-judge-red/30 text-judge-red text-sm px-3 py-1.5 rounded-full"
                    >
                      🚩 {flag.flag}
                    </span>
                  ))}
                  {verdict.red_flags.length > 3 && (
                    <span className="text-white/40 text-sm px-3 py-1.5">
                      +{verdict.red_flags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setShowDetails(true)}
                  className="w-full bg-white/10 border border-white/20 text-white py-4 font-bold tracking-wider rounded-xl hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
                >
                  <span>SEE FULL ANALYSIS</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate('/share')}
                  className="w-full bg-judge-gold text-judge-black py-4 font-bold tracking-wider rounded-xl hover:bg-judge-gold/90 transition-colors"
                >
                  SHARE VERDICT
                </button>
              </div>

              {/* Case number */}
              <div className="text-center pt-2">
                <span className="text-white/20 text-xs tracking-widest">{caseNumber}</span>
              </div>
            </motion.div>
          ) : (
            // EXPANDED DETAILS VIEW
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Back button */}
              <button
                onClick={() => setShowDetails(false)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Summary</span>
              </button>

              {/* Manipulation Tactics */}
              {verdict.manipulation_tactics.length > 0 && (
                <div>
                  <h2 className="text-white text-sm font-bold tracking-widest mb-3">📋 MANIPULATION TACTICS</h2>
                  <div className="space-y-3">
                    {verdict.manipulation_tactics.map((tactic, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-bold">{tactic.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            tactic.severity === 'high'
                              ? 'bg-judge-red/20 text-judge-red'
                              : tactic.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-white/10 text-white/60'
                          }`}>
                            {tactic.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white/60 italic text-sm">"{tactic.evidence}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Log */}
              {verdict.evidence_log.length > 0 && (
                <div>
                  <h2 className="text-white text-sm font-bold tracking-widest mb-3">📁 EVIDENCE LOG</h2>
                  <div className="space-y-3">
                    {verdict.evidence_log.map((item, index) => (
                      <div key={index} className="border-l-2 border-judge-gold/50 pl-4 py-2">
                        <div className="text-judge-gold text-sm font-bold mb-1">Exhibit {item.exhibit}</div>
                        <p className="text-white/80 text-sm">{item.summary}</p>
                        {item.favors !== 'Neither' && (
                          <p className="text-white/40 text-xs mt-1">
                            Favors: {item.favors === 'Party A' ? partyAName : partyBName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Judge's Opinion */}
              <div>
                <h2 className="text-white text-sm font-bold tracking-widest mb-3">⚖️ JUDGE'S FINAL WORD</h2>
                <div className="bg-white/5 border-l-4 border-white/20 p-4 rounded-r-xl">
                  <p className="text-white/80 italic">"{verdict.judges_opinion}"</p>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h2 className="text-white text-sm font-bold tracking-widest mb-3">📜 COURT ORDERS</h2>
                <div className="grid grid-cols-1 gap-3">
                  <div className={`p-4 rounded-xl ${
                    verdict.winner === 'Party A'
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-judge-red/10 border border-judge-red/30'
                  }`}>
                    <div className={`text-xs font-bold tracking-wider mb-1 ${
                      verdict.winner === 'Party A' ? 'text-green-400' : 'text-judge-red'
                    }`}>FOR {partyAName.toUpperCase()}</div>
                    <p className="text-white/70 text-sm">{verdict.recommendations.partyA}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${
                    verdict.winner === 'Party B'
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-judge-red/10 border border-judge-red/30'
                  }`}>
                    <div className={`text-xs font-bold tracking-wider mb-1 ${
                      verdict.winner === 'Party B' ? 'text-green-400' : 'text-judge-red'
                    }`}>FOR {partyBName.toUpperCase()}</div>
                    <p className="text-white/70 text-sm">{verdict.recommendations.partyB}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => navigate('/share')}
                  className="w-full bg-judge-gold text-judge-black py-4 font-bold tracking-wider rounded-xl hover:bg-judge-gold/90 transition-colors"
                >
                  SHARE VERDICT
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('evidence')
                    sessionStorage.removeItem('verdict')
                    navigate('/')
                  }}
                  className="w-full text-white/40 py-3 font-medium hover:text-white/60 transition-colors"
                >
                  New Case
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
