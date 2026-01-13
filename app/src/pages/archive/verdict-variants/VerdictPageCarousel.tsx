import { useEffect, useState, useRef } from 'react'
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

export default function VerdictPageCarousel() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [activeCard, setActiveCard] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
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

  const evidence = JSON.parse(sessionStorage.getItem('evidence') || '{}')
  const partyAName = evidence.partyA || 'Party A'
  const partyBName = evidence.partyB || 'Party B'

  const winnerName = verdict.winner === 'Party A' ? partyAName :
                     verdict.winner === 'Party B' ? partyBName : 'Draw'
  const loserName = verdict.winner === 'Party A' ? partyBName :
                    verdict.winner === 'Party B' ? partyAName : null
  const winnerCredibility = verdict.winner === 'Party A' ? verdict.credibility.partyA : verdict.credibility.partyB

  // Card data
  const cards = [
    // Card 1: Winner
    {
      id: 'winner',
      title: 'THE VERDICT',
      color: 'green',
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="text-green-400 text-xs font-bold tracking-[0.2em] mb-2">WINNER</div>
          <h2 className="text-4xl font-black text-white mb-3">{winnerName}</h2>
          <p className="text-white/60 text-sm mb-4 line-clamp-3">{verdict.winner_reason}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-green-400 text-3xl font-bold">{winnerCredibility}%</span>
            <span className="text-white/40">credibility</span>
          </div>
        </div>
      )
    },
    // Card 2: At Fault
    ...(loserName ? [{
      id: 'fault',
      title: 'AT FAULT',
      color: 'red',
      content: (
        <div className="h-full flex flex-col justify-center items-center text-center">
          {/* Meme image */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-judge-red/40 mb-4">
            <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 z-0">
              <span className="text-3xl opacity-50">{getShameEmoji(wrongPercent)}</span>
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
          <div className="text-judge-red text-xs font-bold tracking-[0.2em] mb-2">{shameLabel}</div>
          <h2 className="text-4xl font-black text-white mb-3">{loserName}</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-judge-red text-4xl font-black">{wrongPercent}%</span>
            <span className="text-white/40">wrong</span>
          </div>
        </div>
      )
    }] : []),
    // Card 3: Toxicity
    {
      id: 'toxicity',
      title: 'TOXICITY',
      color: verdict.toxicity >= 50 ? 'red' : 'neutral',
      content: (
        <div className="h-full flex flex-col justify-center items-center text-center">
          <div className={`text-6xl mb-4 ${verdict.toxicity >= 50 ? '' : 'grayscale opacity-50'}`}>🔥</div>
          <div className={`text-xs font-bold tracking-[0.2em] mb-2 ${
            verdict.toxicity >= 50 ? 'text-judge-red' : 'text-white/40'
          }`}>TOXICITY LEVEL</div>
          <div className={`text-6xl font-black ${
            verdict.toxicity >= 50 ? 'text-judge-red' : 'text-white'
          }`}>{verdict.toxicity}%</div>
          {verdict.toxicity >= 50 && (
            <div className="text-judge-red text-sm font-bold mt-3 animate-pulse">⚠️ DANGER ZONE</div>
          )}
        </div>
      )
    },
    // Card 4: Red Flags
    ...(verdict.red_flags.length > 0 ? [{
      id: 'redflags',
      title: 'RED FLAGS',
      color: 'red',
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="text-judge-red text-xs font-bold tracking-[0.2em] mb-4">
            🚩 {verdict.red_flags.length} RED FLAGS DETECTED
          </div>
          <div className="space-y-2">
            {verdict.red_flags.slice(0, 4).map((flag, index) => (
              <div
                key={index}
                className="bg-judge-red/10 border border-judge-red/30 px-4 py-2 rounded-lg text-white text-sm"
              >
                {flag.flag}
              </div>
            ))}
            {verdict.red_flags.length > 4 && (
              <div className="text-white/40 text-sm">+{verdict.red_flags.length - 4} more</div>
            )}
          </div>
        </div>
      )
    }] : []),
    // Card 5: Manipulation
    ...(verdict.manipulation_tactics.length > 0 ? [{
      id: 'manipulation',
      title: 'MANIPULATION',
      color: 'neutral',
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="text-white/40 text-xs font-bold tracking-[0.2em] mb-2">PRIMARY TACTIC</div>
          <h2 className="text-2xl font-black text-white mb-3">{verdict.manipulation_tactics[0].name}</h2>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 mt-2">
            <p className="text-white/60 italic text-sm line-clamp-4">"{verdict.manipulation_tactics[0].evidence}"</p>
          </div>
        </div>
      )
    }] : []),
    // Card 6: Judge's Opinion
    {
      id: 'opinion',
      title: 'FINAL WORD',
      color: 'neutral',
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="text-5xl mb-4">⚖️</div>
          <div className="text-white/40 text-xs font-bold tracking-[0.2em] mb-3">JUDGE'S FINAL WORD</div>
          <p className="text-white/80 italic text-sm leading-relaxed line-clamp-6">"{verdict.judges_opinion}"</p>
        </div>
      )
    }
  ]

  const getCardStyle = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30'
      case 'red':
        return 'bg-gradient-to-br from-judge-red/20 to-judge-red/5 border-judge-red/30'
      default:
        return 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft
      const cardWidth = scrollRef.current.offsetWidth * 0.85
      const newActive = Math.round(scrollLeft / cardWidth)
      setActiveCard(newActive)
    }
  }

  return (
    <div className="min-h-screen bg-judge-black flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6 text-center">
        <h1 className="text-white text-sm font-bold tracking-[0.2em]">CASE VERDICT</h1>
      </div>

      {/* Card indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeCard ? 'bg-white w-6' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex-shrink-0 w-[85%] snap-center border rounded-3xl p-6 ${getCardStyle(card.color)}`}
            style={{ minHeight: '400px' }}
          >
            {card.content}
          </motion.div>
        ))}

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: cards.length * 0.1 }}
          className="flex-shrink-0 w-[85%] snap-center bg-gradient-to-br from-judge-gold/20 to-judge-gold/5 border border-judge-gold/30 rounded-3xl p-6 flex flex-col justify-center"
          style={{ minHeight: '400px' }}
        >
          <div className="text-center">
            <div className="text-5xl mb-4">📤</div>
            <h2 className="text-2xl font-bold text-white mb-6">Share Your Verdict</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/share')}
                className="w-full bg-judge-gold text-judge-black py-4 font-bold tracking-wider rounded-xl hover:bg-judge-gold/90 transition-colors"
              >
                CREATE SHARE CARD
              </button>
              <button
                onClick={() => navigate('/verdict')}
                className="w-full border border-white/20 text-white py-3 font-medium tracking-wider rounded-xl hover:bg-white/5 transition-colors"
              >
                View Full Analysis
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
          </div>
        </motion.div>
      </div>

      {/* Swipe hint */}
      <div className="p-4 text-center">
        <span className="text-white/30 text-xs">Swipe to explore →</span>
      </div>
    </div>
  )
}
