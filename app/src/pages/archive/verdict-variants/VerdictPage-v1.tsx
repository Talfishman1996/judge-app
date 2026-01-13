import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { getShameData, getShameEmoji } from '../../../utils/shameTiers'

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
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 23c-3.9 0-7-3.1-7-7 0-2.1.9-4.5 2.5-6.5.2-.2.4-.5.6-.7.4-.5 1-.5 1.4-.1.2.2.4.4.5.7.8 1.1 1.9 2.1 3.2 2.8 0-1.8.4-3.5 1.2-5.1.4-.9.9-1.7 1.5-2.5.3-.4.8-.5 1.2-.3.4.2.6.6.6 1v.3c-.1 1.9-.1 3.5.4 5.2.3.9.7 1.7 1.3 2.4.5.6.8 1.4.8 2.2 0 3.9-3.1 7-7 7z"/>
  </svg>
)

const FingerprintIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)

// Crown icon for winner
const CrownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
)

export default function VerdictPage() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const isToxicityHigh = verdict.toxicity >= 50

  // Get primary manipulation tactic
  const primaryTactic = verdict.manipulation_tactics[0]?.name || 'None detected'

  return (
    <div className="min-h-screen bg-judge-black p-4 sm:p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Case Number */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-judge-white/40 text-xs tracking-widest">{caseNumber}</span>
        </motion.div>

        {/* WINNER HERO CARD */}
        <motion.div
          className="card-winner p-6 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {/* Crown decoration */}
          <div className="absolute -top-2 -right-2 text-green-400/30 transform rotate-12">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            </svg>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="text-green-400">
              <CrownIcon />
            </div>
            <span className="text-green-400 text-sm font-bold tracking-widest">WINNER</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 relative z-10">
            {winnerName}
          </h1>

          <p className="text-white/80 text-lg leading-relaxed mb-4 relative z-10">
            {verdict.winner_reason}
          </p>

          <div className="flex items-center gap-2 text-green-400">
            <CheckIcon />
            <span className="text-2xl font-bold">{winnerCredibility}%</span>
            <span className="text-white/50">credibility</span>
          </div>
        </motion.div>

        {/* VILLAIN/FAULT CARD */}
        {loserName && (
          <motion.div
            className="card-villain p-5 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Meme image or skull icon */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-judge-red/30 flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 z-0">
                    <span className="text-2xl opacity-50">{getShameEmoji(wrongPercent)}</span>
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
                <div>
                  <div className="text-judge-red text-xs font-bold tracking-widest mb-1">{shameLabel}</div>
                  <div className="text-2xl font-bold text-white">{loserName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-judge-red text-3xl font-black">
                  {wrongPercent}%
                </div>
                <div className="text-white/50 text-xs">wrong</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TOXICITY METER - The Drama */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={isToxicityHigh ? 'card-toxic p-5' : 'card-dark p-5'}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isToxicityHigh ? 'bg-judge-red/30 text-judge-red' : 'bg-white/10 text-white/60'
                }`}>
                  <FlameIcon />
                </div>
                <div>
                  <div className={`text-xs font-bold tracking-widest mb-1 ${isToxicityHigh ? 'text-judge-red' : 'text-white/50'}`}>
                    TOXICITY LEVEL
                  </div>
                  <div className={`text-sm ${isToxicityHigh ? 'text-judge-red' : 'text-white/60'}`}>
                    {isToxicityHigh ? '⚠️ DANGER ZONE' : 'Within acceptable limits'}
                  </div>
                </div>
              </div>
              <div className={`text-5xl font-black ${isToxicityHigh ? 'text-judge-red' : 'text-white'}`}>
                {verdict.toxicity}%
              </div>
            </div>

            {/* Toxicity bar */}
            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  verdict.toxicity >= 70 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                  verdict.toxicity >= 50 ? 'bg-gradient-to-r from-orange-600 to-red-500' :
                  verdict.toxicity >= 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-green-500 to-green-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${verdict.toxicity}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Primary Manipulation Pattern */}
        <motion.div
          className="card-dark p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white/60 flex items-center justify-center">
              <FingerprintIcon />
            </div>
            <div>
              <div className="text-white/50 text-xs font-bold tracking-widest mb-1">PRIMARY PATTERN</div>
              <div className="text-2xl font-bold text-white">{primaryTactic}</div>
            </div>
          </div>
        </motion.div>

        {/* RED FLAGS - Warning Zone */}
        {verdict.red_flags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-judge-red text-sm font-bold tracking-widest">🚩 RED FLAGS</span>
              <span className="bg-judge-red/20 text-judge-red text-xs font-bold px-2 py-1 rounded-full">
                {verdict.red_flags.length} DETECTED
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {verdict.red_flags.map((flag, index) => (
                <motion.span
                  key={index}
                  className="pill pill-red"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {flag.flag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* MANIPULATION TACTICS - The Receipts */}
        {verdict.manipulation_tactics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-white text-sm font-bold tracking-widest mb-3">📋 MANIPULATION TACTICS</h2>
            <div className="space-y-3">
              {verdict.manipulation_tactics.map((tactic, index) => (
                <div key={index} className="card-dark p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-judge-white font-bold">{tactic.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      tactic.severity === 'high'
                        ? 'bg-judge-red/20 text-judge-red'
                        : tactic.severity === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-judge-white/10 text-judge-white/60'
                    }`}>
                      {tactic.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="evidence-quote pl-4 py-2">
                    <p className="text-judge-white/70 italic">"{tactic.evidence}"</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* EVIDENCE LOG - The Receipts */}
        {verdict.evidence_log.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-white text-sm font-bold tracking-widest">📁 EVIDENCE LOG</h2>
              <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full">
                {verdict.evidence_log.length} exhibits
              </span>
            </div>
            <div className="space-y-3">
              {verdict.evidence_log.map((item, index) => (
                <div key={index} className="evidence-quote pl-4 py-3">
                  <div className="text-judge-gold text-sm font-bold mb-1">Exhibit {item.exhibit}</div>
                  <p className="text-judge-white/80">{item.summary}</p>
                  {item.favors !== 'Neither' && (
                    <p className="text-judge-white/50 text-sm mt-1">
                      Favors: <span className="text-judge-gold">{item.favors === 'Party A' ? partyAName : partyBName}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* JUDGE'S FINAL WORD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h2 className="text-white text-sm font-bold tracking-widest mb-3">⚖️ JUDGE'S FINAL WORD</h2>
          <div className="card-dark p-5 border-l-4 border-white/30">
            <p className="text-white/90 leading-relaxed text-lg italic">"{verdict.judges_opinion}"</p>
          </div>
        </motion.div>

        {/* COURT ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-white text-sm font-bold tracking-widest mb-3">📜 COURT ORDERS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={verdict.winner === 'Party A' ? 'card-winner p-4' : 'card-villain p-4'}>
              <div className={`text-xs font-bold tracking-widest mb-2 ${verdict.winner === 'Party A' ? 'text-green-400' : 'text-judge-red'}`}>
                FOR {partyAName.toUpperCase()}
              </div>
              <p className="text-white/80 text-sm">{verdict.recommendations.partyA}</p>
            </div>
            <div className={verdict.winner === 'Party B' ? 'card-winner p-4' : 'card-villain p-4'}>
              <div className={`text-xs font-bold tracking-widest mb-2 ${verdict.winner === 'Party B' ? 'text-green-400' : 'text-judge-red'}`}>
                FOR {partyBName.toUpperCase()}
              </div>
              <p className="text-white/80 text-sm">{verdict.recommendations.partyB}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={() => navigate('/share')}
            className="flex-1 bg-judge-gold text-judge-black py-4 font-bold tracking-wider rounded-xl hover:bg-judge-gold/90 transition-colors"
          >
            SHARE VERDICT
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('evidence')
              sessionStorage.removeItem('verdict')
              navigate('/')
            }}
            className="flex-1 border border-judge-white/20 text-judge-white py-4 font-bold tracking-wider rounded-xl hover:bg-judge-white/5 transition-colors"
          >
            NEW CASE
          </button>
        </motion.div>
      </div>
    </div>
  )
}
