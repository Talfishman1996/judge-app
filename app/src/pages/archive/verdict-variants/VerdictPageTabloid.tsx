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

export default function VerdictPageTabloid() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [revealed, setRevealed] = useState(false)
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

    // Dramatic reveal delay
    setTimeout(() => setRevealed(true), 500)
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(220,38,38,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(0,0,0,1) 0%, transparent 50%)',
        }}
      />

      {/* Diagonal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            white 0px,
            white 1px,
            transparent 1px,
            transparent 40px
          )`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Top section - LOSER with meme */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center items-center px-6 pt-8 pb-4"
          style={{
            background: 'linear-gradient(180deg, rgba(127,29,29,0.2) 0%, transparent 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-center"
          >
            {/* Shame label badge */}
            <div className="text-red-500 text-xs font-black tracking-[0.3em] mb-2 bg-red-500/10 px-3 py-1 rounded-full inline-block">
              {shameLabel}
            </div>

            {/* Meme image */}
            <div className="relative w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden border-2 border-red-500/30">
              <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 z-0">
                <span className="text-4xl opacity-50">{getShameEmoji(wrongPercent)}</span>
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

            <h2 className="text-white/40 text-2xl font-black tracking-wide line-through decoration-red-500/50">
              {loserName}
            </h2>
            <div className="mt-2 text-red-500/80 text-3xl font-black">
              {wrongPercent}% WRONG
            </div>
          </motion.div>
        </motion.div>

        {/* Center VS divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
            className="relative flex justify-center"
          >
            <span className="bg-black px-6 text-white/20 text-xl font-black tracking-widest">
              VS
            </span>
          </motion.div>
        </div>

        {/* Bottom section - WINNER (hero) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-[2] flex flex-col justify-center items-center px-6 pb-4 relative"
        >
          {/* Glow effect behind winner */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: revealed ? 0.3 : 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="w-64 h-64 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring', stiffness: 200 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-emerald-400 text-xs font-bold tracking-[0.4em] mb-3"
            >
              ★ NOT GUILTY ★
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="text-white text-5xl font-black tracking-tight mb-2"
              style={{
                textShadow: '0 0 40px rgba(34,197,94,0.3)',
              }}
            >
              {winnerName}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-emerald-400 text-6xl font-black"
            >
              {winnerCredibility}%
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/30 text-xs tracking-widest mt-1"
            >
              CREDIBILITY SCORE
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="px-6 pb-4"
        >
          {/* Toxicity */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/40 text-xs font-bold tracking-wider">TOXICITY</span>
              <span className={`text-2xl font-black ${verdict.toxicity >= 50 ? 'text-red-500' : 'text-white/60'}`}>
                {verdict.toxicity}%
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${verdict.toxicity}%` }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="h-full rounded-full"
                style={{
                  background: verdict.toxicity >= 50
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                }}
              />
            </div>
          </div>

          {/* Red flags */}
          {verdict.red_flags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {verdict.red_flags.map((flag, i) => (
                <span
                  key={i}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full"
                >
                  {flag.flag}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Verdict text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="px-6 pb-4"
        >
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/50 text-sm leading-relaxed">
              {verdict.judges_opinion}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="px-6 pb-8 space-y-3"
        >
          <button
            onClick={() => navigate('/share')}
            className="w-full py-4 rounded-xl font-bold tracking-wider text-black relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            }}
          >
            SHARE VERDICT
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('evidence')
              sessionStorage.removeItem('verdict')
              navigate('/')
            }}
            className="w-full py-3 text-white/30 hover:text-white/50 font-medium tracking-wider transition-colors"
          >
            New Case
          </button>
        </motion.div>
      </div>
    </div>
  )
}
