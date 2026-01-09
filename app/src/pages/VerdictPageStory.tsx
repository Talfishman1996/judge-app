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

// Crown icon
const CrownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
)

// Flame icon
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
    <path d="M12 23c-3.9 0-7-3.1-7-7 0-2.1.9-4.5 2.5-6.5.2-.2.4-.5.6-.7.4-.5 1-.5 1.4-.1.2.2.4.4.5.7.8 1.1 1.9 2.1 3.2 2.8 0-1.8.4-3.5 1.2-5.1.4-.9.9-1.7 1.5-2.5.3-.4.8-.5 1.2-.3.4.2.6.6.6 1v.3c-.1 1.9-.1 3.5.4 5.2.3.9.7 1.7 1.3 2.4.5.6.8 1.4.8 2.2 0 3.9-3.1 7-7 7z"/>
  </svg>
)

export default function VerdictPageStory() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
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

  const evidence = JSON.parse(sessionStorage.getItem('evidence') || '{}')
  const partyAName = evidence.partyA || 'Party A'
  const partyBName = evidence.partyB || 'Party B'

  const winnerName = verdict.winner === 'Party A' ? partyAName :
                     verdict.winner === 'Party B' ? partyBName : 'Draw'
  const loserName = verdict.winner === 'Party A' ? partyBName :
                    verdict.winner === 'Party B' ? partyAName : null
  const winnerCredibility = verdict.winner === 'Party A' ? verdict.credibility.partyA : verdict.credibility.partyB

  // Build slides array
  const slides = [
    // Slide 0: The Winner Reveal
    {
      id: 'winner',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-green-400 mb-4"
          >
            <CrownIcon />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-400 text-sm font-bold tracking-[0.3em] mb-4"
          >
            THE COURT FINDS IN FAVOR OF
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="text-6xl sm:text-8xl font-black text-white mb-6"
          >
            {winnerName}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-green-400 text-3xl font-bold"
          >
            {winnerCredibility}% Credibility
          </motion.div>
        </div>
      )
    },
    // Slide 1: The Villain
    {
      id: 'villain',
      content: loserName ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          {/* Meme image */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-judge-red/40 mb-4"
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-judge-red text-sm font-bold tracking-[0.3em] mb-4"
          >
            {shameLabel}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl sm:text-7xl font-black text-white mb-6"
          >
            {loserName}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-judge-red text-4xl font-black"
          >
            {wrongPercent}% WRONG
          </motion.div>
        </div>
      ) : null
    },
    // Slide 2: Toxicity
    {
      id: 'toxicity',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className={verdict.toxicity >= 50 ? 'text-judge-red' : 'text-white/60'}
          >
            <FlameIcon />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-sm font-bold tracking-[0.3em] mt-4 mb-2"
          >
            TOXICITY LEVEL
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className={`text-8xl font-black ${verdict.toxicity >= 50 ? 'text-judge-red' : 'text-white'}`}
          >
            {verdict.toxicity}%
          </motion.div>
          {verdict.toxicity >= 50 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-judge-red text-xl font-bold mt-4 animate-pulse"
            >
              ⚠️ DANGER ZONE ⚠️
            </motion.div>
          )}
        </div>
      )
    },
    // Slide 3: Red Flags
    {
      id: 'redflags',
      content: verdict.red_flags.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-6xl mb-4"
          >
            🚩
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-judge-red text-sm font-bold tracking-[0.3em] mb-6"
          >
            RED FLAGS DETECTED
          </motion.div>
          <div className="space-y-3">
            {verdict.red_flags.map((flag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.15 }}
                className="bg-judge-red/20 border border-judge-red/40 px-6 py-3 rounded-full text-judge-red font-bold"
              >
                {flag.flag}
              </motion.div>
            ))}
          </div>
        </div>
      ) : null
    },
    // Slide 4: Primary Manipulation Tactic
    {
      id: 'manipulation',
      content: verdict.manipulation_tactics.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl mb-4"
          >
            🎭
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm font-bold tracking-[0.3em] mb-4"
          >
            PRIMARY MANIPULATION TACTIC
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl font-black text-white mb-6"
          >
            {verdict.manipulation_tactics[0].name}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-sm"
          >
            <p className="text-white/70 italic">"{verdict.manipulation_tactics[0].evidence}"</p>
          </motion.div>
        </div>
      ) : null
    },
    // Slide 5: Judge's Opinion
    {
      id: 'opinion',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl mb-4"
          >
            ⚖️
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm font-bold tracking-[0.3em] mb-6"
          >
            JUDGE'S FINAL WORD
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border-l-4 border-white/30 p-6 max-w-md"
          >
            <p className="text-white/90 text-lg italic leading-relaxed">"{verdict.judges_opinion}"</p>
          </motion.div>
        </div>
      )
    },
    // Slide 6: Final CTA
    {
      id: 'cta',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/40 text-sm font-bold tracking-[0.3em] mb-8"
          >
            CASE CLOSED
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 w-full max-w-xs"
          >
            <button
              onClick={() => navigate('/share')}
              className="w-full bg-judge-gold text-judge-black py-4 font-bold tracking-wider rounded-xl hover:bg-judge-gold/90 transition-colors text-lg"
            >
              SHARE VERDICT
            </button>
            <button
              onClick={() => navigate('/verdict')}
              className="w-full border border-white/20 text-white py-4 font-bold tracking-wider rounded-xl hover:bg-white/5 transition-colors"
            >
              VIEW FULL ANALYSIS
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
          </motion.div>
        </div>
      )
    }
  ].filter(slide => slide.content !== null)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-judge-black flex flex-col">
      {/* Progress bar */}
      <div className="flex gap-1 p-3 pt-16">
        {slides.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/20"
          >
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: index < currentSlide ? '100%' : index === currentSlide ? '100%' : '0%' }}
              transition={{ duration: index === currentSlide ? 0.3 : 0 }}
            />
          </div>
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {slides[currentSlide].content}
          </motion.div>
        </AnimatePresence>

        {/* Touch zones */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={prevSlide} />
          <div className="w-2/3 h-full cursor-pointer" onClick={nextSlide} />
        </div>
      </div>

      {/* Navigation hint */}
      <div className="p-4 text-center">
        <span className="text-white/30 text-xs">Tap to continue</span>
      </div>
    </div>
  )
}
