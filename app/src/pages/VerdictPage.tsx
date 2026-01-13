import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { getShameData } from '../utils/shameTiers'

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

// Icons as inline SVGs
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 23c-3.9 0-7-3.1-7-7 0-2.1.9-4.5 2.5-6.5.2-.2.4-.5.6-.7.4-.5 1-.5 1.4-.1.2.2.4.4.5.7.8 1.1 1.9 2.1 3.2 2.8 0-1.8.4-3.5 1.2-5.1.4-.9.9-1.7 1.5-2.5.3-.4.8-.5 1.2-.3.4.2.6.6.6 1v.3c-.1 1.9-.1 3.5.4 5.2.3.9.7 1.7 1.3 2.4.5.6.8 1.4.8 2.2 0 3.9-3.1 7-7 7z" />
  </svg>
)

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
)

const GavelIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M1 21h12v2H1v-2zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828L5.245 8.07zM12.317 1l5.657 5.656-2.83 2.83-5.654-5.66L12.317 1zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657 2.828-2.828z" />
  </svg>
)

export default function VerdictPage() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [shameImage, setShameImage] = useState<string>('')
  const [shameLabel, setShameLabel] = useState<string>('')
  const [wrongPercent, setWrongPercent] = useState(0)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const [selectedTactic, setSelectedTactic] = useState<{ name: string; evidence: string; severity: string } | null>(null)
  const [showToxicityBreakdown, setShowToxicityBreakdown] = useState(false)

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

  // Get toxicity level label
  const getToxicityLabel = (toxicity: number) => {
    if (toxicity >= 70) return 'HIGH'
    if (toxicity >= 40) return 'MEDIUM'
    return 'LOW'
  }

  // Get primary manipulation tactic
  const primaryTactic = verdict.manipulation_tactics[0]?.name || 'None detected'

  // Get all tactic names for pills
  const tacticNames = verdict.manipulation_tactics.map(t => t.name)

  // Format evidence log entries for display
  const formatEvidenceEntry = (item: { exhibit: string; summary: string; favors: string }) => {
    // Try to extract a label and quote from the summary
    const colonIndex = item.summary.indexOf(':')
    if (colonIndex > 0 && colonIndex < 30) {
      const label = item.summary.substring(0, colonIndex).trim()
      const rest = item.summary.substring(colonIndex + 1).trim()
      // Check if there's a quote in the rest
      const quoteMatch = rest.match(/"([^"]+)"/)
      if (quoteMatch) {
        const quote = quoteMatch[1]
        const analysis = rest.replace(/"[^"]+"/, '').replace(/^[\s-]+/, '').trim()
        return { label, quote, analysis }
      }
      return { label, quote: null, analysis: rest }
    }
    return { label: `Evidence ${item.exhibit}`, quote: null, analysis: item.summary }
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <div className="max-w-md mx-auto space-y-5">

        {/* Header */}
        <motion.div
          className="flex items-center justify-between py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-6" /> {/* Spacer for centering */}
          <h1 className="text-white text-lg font-bold tracking-widest">FINAL VERDICT</h1>
          <button
            onClick={() => navigate('/settings')}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SettingsIcon />
          </button>
        </motion.div>

        {/* THE JUDGMENT Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-white/60 text-xs font-bold tracking-widest mb-3">THE JUDGMENT</h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Winner Card - Green */}
            <motion.div
              className="rounded-xl p-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.1) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.4)'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            >
              {/* Large green checkmark circle */}
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckIcon />
                </div>
              </div>

              <div className="text-center">
                <div className="text-emerald-400 text-xs font-bold tracking-widest mb-1">CLEARED</div>
                <div className="text-white text-2xl font-bold mb-1">{winnerName}</div>
                <div className="text-emerald-400 text-base font-bold mb-2">{winnerCredibility}% RIGHT</div>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  {verdict.winner_reason.length > 60
                    ? verdict.winner_reason.substring(0, 60) + '...'
                    : verdict.winner_reason}
                </p>
              </div>
            </motion.div>

            {/* Loser Card - Red */}
            {loserName && (
              <motion.div
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(220, 38, 38, 0.35) 0%, rgba(220, 38, 38, 0.15) 100%)',
                  border: '1px solid rgba(220, 38, 38, 0.5)'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {/* Stamp-style shame badge */}
                <div className="flex justify-center mb-2">
                  <div
                    className="relative transform -rotate-3"
                    style={{
                      padding: '4px 12px',
                      border: '3px solid #dc2626',
                      borderRadius: '4px',
                      background: 'transparent',
                    }}
                  >
                    {/* Distressed overlay effect */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(220,38,38,0.3) 2px, rgba(220,38,38,0.3) 4px)',
                      }}
                    />
                    <span
                      className="relative text-red-500 text-sm font-black tracking-wider"
                      style={{
                        textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {shameLabel}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-white text-2xl font-bold mb-0">{loserName}</div>
                  <div className="text-red-500 text-xl font-black mb-3">{wrongPercent}% WRONG</div>

                  {/* Meme image with EXHIBIT A label */}
                  <div className="relative w-14 h-14 mx-auto rounded overflow-hidden border border-white/20">
                    {shameImage && (
                      <img
                        src={shameImage}
                        alt="Reaction"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-[7px] font-bold tracking-wider text-center py-0.5">
                      EXHIBIT A
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* KEY METRICS Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-white/60 text-xs font-bold tracking-widest mb-3">KEY METRICS</h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Toxicity Level Card */}
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-red-500">
                  <FlameIcon />
                </div>
                <span className="text-white/60 text-xs">Toxicity Level</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-white text-xl font-bold">{verdict.toxicity}%</span>
                <span className="text-red-500 text-sm font-bold">{getToxicityLabel(verdict.toxicity)}</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${verdict.toxicity}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Primary Pattern Card */}
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-white/60">
                  <BrainIcon />
                </div>
                <span className="text-white/60 text-xs">Primary Pattern</span>
              </div>
              <div className="text-white text-lg font-bold">{primaryTactic}</div>
            </div>
          </div>
        </motion.div>

        {/* TACTICS IDENTIFIED Section */}
        {tacticNames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-white/60 text-xs font-bold tracking-widest mb-3">TACTICS IDENTIFIED</h2>
            <div className="flex flex-wrap gap-2">
              {tacticNames.map((tactic, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedTactic(verdict.manipulation_tactics[index])}
                  className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-white/5"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(34, 197, 94, 0.6)',
                    color: '#22c55e'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  {tactic}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* EVIDENCE LOG Section */}
        {verdict.evidence_log.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-white/60 text-xs font-bold tracking-widest mb-3">EVIDENCE LOG</h2>
            <div className="space-y-3">
              {verdict.evidence_log.slice(0, 3).map((item, index) => {
                const formatted = formatEvidenceEntry(item)
                return (
                  <div key={index}
                  onClick={() => setSelectedTactic(verdict.manipulation_tactics[index])} className="text-sm leading-relaxed">
                    <span className="text-white/40">[{String(index + 1).padStart(2, '0')}]</span>{' '}
                    <span className="text-white font-bold">{formatted.label}:</span>{' '}
                    {formatted.quote && (
                      <span className="text-white/70">"{formatted.quote}"</span>
                    )}
                    {formatted.quote && formatted.analysis && ' - '}
                    {formatted.analysis && (
                      <span className="text-white/60">{formatted.analysis}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Actions Section */}
        <motion.div
          className="space-y-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Share Verdict Button */}
          <button
            onClick={() => navigate('/share')}
            className="w-full py-4 rounded-xl font-bold tracking-wider text-black text-sm"
            style={{ backgroundColor: '#facc15' }}
          >
            SHARE VERDICT
          </button>

          {/* See Full Analysis Link */}
          <button
            onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            className="w-full py-2 text-yellow-400 font-bold tracking-wider text-sm hover:text-yellow-300 transition-colors"
          >
            {showFullAnalysis ? 'HIDE FULL ANALYSIS' : 'SEE FULL ANALYSIS'}
          </button>

          {/* Expanded Full Analysis */}
          {showFullAnalysis && (
            <motion.div
              className="space-y-5 pt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Red Flags */}
              {verdict.red_flags.length > 0 && (
                <div>
                  <h3 className="text-red-500 text-xs font-bold tracking-widest mb-2">RED FLAGS</h3>
                  <div className="space-y-2">
                    {verdict.red_flags.map((flag, index) => (
                      <div
                        key={index}
                  onClick={() => setSelectedTactic(verdict.manipulation_tactics[index])}
                        className="p-3 rounded-lg"
                        style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
                      >
                        <div className="text-red-400 font-bold text-sm mb-1">{flag.flag}</div>
                        <div className="text-white/60 text-xs">
                          <span className="text-white/40">({flag.party === 'Party A' ? partyAName : partyBName})</span>{' '}
                          "{flag.evidence}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Manipulation Tactics */}
              {verdict.manipulation_tactics.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-xs font-bold tracking-widest mb-2">MANIPULATION TACTICS (DETAILED)</h3>
                  <div className="space-y-2">
                    {verdict.manipulation_tactics.map((tactic, index) => (
                      <div
                        key={index}
                  onClick={() => setSelectedTactic(verdict.manipulation_tactics[index])}
                        className="p-3 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-sm">{tactic.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${tactic.severity === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : tactic.severity === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-white/10 text-white/60'
                            }`}>
                            {tactic.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-white/60 text-xs italic">"{tactic.evidence}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Judge's Opinion */}
              <div>
                <h3 className="text-white/60 text-xs font-bold tracking-widest mb-2">JUDGE'S OPINION</h3>
                <div
                  className="p-4 rounded-lg border-l-4 border-white/30"
                  style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <p className="text-white/80 text-sm italic leading-relaxed">"{verdict.judges_opinion}"</p>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-white/60 text-xs font-bold tracking-widest mb-2">RECOMMENDATIONS</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: verdict.winner === 'Party A'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(220, 38, 38, 0.1)',
                      border: verdict.winner === 'Party A'
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : '1px solid rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <div className={`text-xs font-bold tracking-wider mb-1 ${verdict.winner === 'Party A' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                      FOR {partyAName.toUpperCase()}
                    </div>
                    <p className="text-white/70 text-sm">{verdict.recommendations.partyA}</p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: verdict.winner === 'Party B'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(220, 38, 38, 0.1)',
                      border: verdict.winner === 'Party B'
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : '1px solid rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <div className={`text-xs font-bold tracking-wider mb-1 ${verdict.winner === 'Party B' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                      FOR {partyBName.toUpperCase()}
                    </div>
                    <p className="text-white/70 text-sm">{verdict.recommendations.partyB}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Case Closed Footer - Red gradient background */}
          <div
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.3) 0%, rgba(185, 28, 28, 0.4) 50%, rgba(220, 38, 38, 0.3) 100%)',
              border: '1px solid rgba(220, 38, 38, 0.4)'
            }}
          >
            <span className="text-red-400">
              <GavelIcon />
            </span>
            <span className="text-red-400 font-bold tracking-wider text-sm">CASE CLOSED</span>
          </div>
        </motion.div>



        {/* Tactic Detail Modal */}
        <AnimatePresence>
          {selectedTactic && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTactic(null)}
            >
              <motion.div
                className="bg-black border border-white/20 rounded-xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">{selectedTactic.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    selectedTactic.severity === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : selectedTactic.severity === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-white/10 text-white/60'
                  }`}>
                    {selectedTactic.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  This manipulation tactic was identified in the conversation.
                </p>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="text-white/40 text-xs mb-2">EVIDENCE:</div>
                  <p className="text-white/80 text-sm italic">"{selectedTactic.evidence}"</p>
                </div>
                <button
                  onClick={() => setSelectedTactic(null)}
                  className="w-full py-3 bg-white/10 rounded-lg text-white font-bold text-sm hover:bg-white/20 transition-colors"
                >
                  CLOSE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toxicity Breakdown Modal */}
        <AnimatePresence>
          {showToxicityBreakdown && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowToxicityBreakdown(false)}
            >
              <motion.div
                className="bg-black border border-white/20 rounded-xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-white font-bold text-lg mb-4">Toxicity Breakdown</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Overall Toxicity</span>
                    <span className="text-red-400 font-bold">{verdict.toxicity}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
                      style={{ width: `${verdict.toxicity}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 text-center text-xs text-white/40">
                    <span>LOW</span>
                    <span>MEDIUM</span>
                    <span>HIGH</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="text-white/40 text-xs mb-2">CONTRIBUTING FACTORS:</div>
                  <ul className="space-y-2">
                    {verdict.manipulation_tactics.slice(0, 3).map((tactic, i) => (
                      <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {tactic.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setShowToxicityBreakdown(false)}
                  className="w-full py-3 bg-white/10 rounded-lg text-white font-bold text-sm hover:bg-white/20 transition-colors"
                >
                  CLOSE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
