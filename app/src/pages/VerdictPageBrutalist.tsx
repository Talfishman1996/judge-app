import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

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

// Shame tiers based on "% wrong" (51-100%)
// Curated face-focused memes without text overlays - knowyourmeme CDN
const SHAME_TIERS: Record<string, { images: string[]; label: string }> = {
  // 50% exactly - DRAW (tough decision vibe)
  tier_draw: {
    label: 'DRAW',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/023/397/C-658VsXoAo3ovC.jpg', // Two buttons sweating
      'https://i.kym-cdn.com/entries/icons/original/000/019/571/dailystruggg.jpg', // Daily struggle
    ],
  },
  // 51-55%: Barely wrong - skeptical side-eye (clean faces only)
  tier_51_55: {
    label: 'SUSPECT',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/014/285/sideeyechloe.jpg', // Side-eye Chloe
      'https://i.kym-cdn.com/entries/icons/original/000/006/026/NOTSUREIF.jpg', // Fry squint
      'https://i.kym-cdn.com/entries/icons/original/000/030/157/womanyellingcat.jpg', // Woman yelling at cat
    ],
  },
  // 56-60%: Something's off - confused/questioning (clean faces only)
  tier_56_60: {
    label: 'SUSPICIOUS',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/018/489/nick-young-confused-face-300x256-nqlyaa.jpg', // Nick Young ???
      'https://i.kym-cdn.com/entries/icons/original/000/021/464/14608107_1180665285312703_1558693314_n.jpg', // Confused math lady
      'https://i.kym-cdn.com/entries/icons/original/000/000/015/oreally.jpg', // O RLY owl skeptical
    ],
  },
  // 61-65%: Caught - surprised/busted (clean faces only)
  tier_61_65: {
    label: 'CAUGHT',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/006/506/pogchamp.jpg', // PogChamp surprised face
      'https://i.kym-cdn.com/entries/icons/original/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.png', // Surprised Pikachu
      'https://i.kym-cdn.com/entries/icons/original/000/026/913/excuse.jpg', // Blinking guy surprised
    ],
  },
  // 66-70%: Exposed - disapproval/judgment (clean faces only)
  tier_66_70: {
    label: 'EXPOSED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/021/557/conceit.jpg', // Conceited reaction face
      'https://i.kym-cdn.com/entries/icons/original/000/028/232/hamster.jpg', // Staring hamster
      'https://i.kym-cdn.com/entries/icons/original/000/028/861/cover3.jpg', // Monkey puppet side-eye
    ],
  },
  // 71-75%: Busted - facepalm/disappointment
  tier_71_75: {
    label: 'BUSTED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg', // Hide the Pain Harold
      'https://i.kym-cdn.com/entries/icons/original/000/000/554/picard-facepalm.jpg', // Picard facepalm
      'https://i.kym-cdn.com/entries/icons/original/000/034/890/cover3.jpg', // Oh no anyway
    ],
  },
  // 76-80%: Guilty - accepting fate/this is fine
  tier_76_80: {
    label: 'GUILTY',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/018/012/this_is_fine.jpeg', // This is fine dog
      'https://i.kym-cdn.com/entries/icons/original/000/025/621/Screen_Shot_2018-03-07_at_2.08.13_PM.png', // Guy on phone disgusted
      'https://i.kym-cdn.com/entries/icons/original/000/028/539/DyqSKoaX4AATc2G.jpg', // Hard to swallow pills
    ],
  },
  // 81-85%: Condemned - shame/crying
  tier_81_85: {
    label: 'CONDEMNED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/023/987/overcome.jpg', // Crying Jordan
      'https://i.kym-cdn.com/entries/icons/original/000/022/508/C7S0ouqVAAAwEIo.jpg', // Sad cat with tears
      'https://i.kym-cdn.com/entries/icons/original/000/025/543/thumbnail.jpg', // Sad Pablo Escobar
    ],
  },
  // 86-90%: Destroyed - devastation/PTSD
  tier_86_90: {
    label: 'DESTROYED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/033/701/PTSD_Chihuahua_Banner.jpg', // PTSD chihuahua
      'https://i.kym-cdn.com/photos/images/original/001/384/545/7b9.jpg', // Crying cat thumbs up
      'https://i.kym-cdn.com/entries/icons/original/000/029/927/cover4.jpg', // Thanos impossible
    ],
  },
  // 91-95%: Annihilated - chaos/disaster
  tier_91_95: {
    label: 'ANNIHILATED',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/000/043/disaster-girl.jpg', // Disaster girl
      'https://i.kym-cdn.com/entries/icons/original/000/034/772/Untitled-1.png', // Sad Keanu
      'https://i.kym-cdn.com/entries/icons/original/000/032/991/hell.jpg', // Elmo fire
    ],
  },
  // 96-100%: Maximum clown - full circus (single faces only)
  tier_96_100: {
    label: 'CLOWN',
    images: [
      'https://i.kym-cdn.com/entries/icons/original/000/032/858/cover1.jpg', // Joker "you get what you deserve"
      'https://i.kym-cdn.com/entries/icons/original/000/023/882/maxresdefault.jpg', // Pennywise dancing
      'https://i.kym-cdn.com/entries/icons/original/000/016/729/large.jpg', // Laughing Tom Cruise
    ],
  },
}

function getShameData(wrongPercent: number): { image: string; label: string } {
  let tier: keyof typeof SHAME_TIERS

  if (wrongPercent === 50) tier = 'tier_draw'
  else if (wrongPercent <= 55) tier = 'tier_51_55'
  else if (wrongPercent <= 60) tier = 'tier_56_60'
  else if (wrongPercent <= 65) tier = 'tier_61_65'
  else if (wrongPercent <= 70) tier = 'tier_66_70'
  else if (wrongPercent <= 75) tier = 'tier_71_75'
  else if (wrongPercent <= 80) tier = 'tier_76_80'
  else if (wrongPercent <= 85) tier = 'tier_81_85'
  else if (wrongPercent <= 90) tier = 'tier_86_90'
  else if (wrongPercent <= 95) tier = 'tier_91_95'
  else tier = 'tier_96_100'

  const tierData = SHAME_TIERS[tier]
  const randomImage = tierData.images[Math.floor(Math.random() * tierData.images.length)]

  return { image: randomImage, label: tierData.label }
}

export default function VerdictPageBrutalist() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [phase, setPhase] = useState(0)
  const [caseNumber] = useState(() => Math.floor(Math.random() * 900000) + 100000)
  const [shameImage, setShameImage] = useState<string>('')
  const [shameLabel, setShameLabel] = useState<string>('')

  useEffect(() => {
    const verdictData = sessionStorage.getItem('verdict') || localStorage.getItem('verdict')
    if (!verdictData) {
      navigate('/')
      return
    }
    const parsedVerdict = JSON.parse(verdictData)
    setVerdict(parsedVerdict)

    // Calculate wrong percent and set shame data once
    const loserCred = parsedVerdict.winner === 'Party A'
      ? parsedVerdict.credibility.partyB
      : parsedVerdict.credibility.partyA
    const wrongPercent = 100 - loserCred
    const shameData = getShameData(wrongPercent)
    setShameImage(shameData.image)
    setShameLabel(shameData.label)

    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [navigate])

  if (!verdict) return null

  const evidence = JSON.parse(sessionStorage.getItem('evidence') || localStorage.getItem('evidence') || '{}')
  const partyAName = evidence.partyA || 'Party A'
  const partyBName = evidence.partyB || 'Party B'

  const winnerName = verdict.winner === 'Party A' ? partyAName :
                     verdict.winner === 'Party B' ? partyBName : 'DRAW'
  const loserName = verdict.winner === 'Party A' ? partyBName :
                    verdict.winner === 'Party B' ? partyAName : null
  const loserCredibility = verdict.winner === 'Party A' ? verdict.credibility.partyB : verdict.credibility.partyA
  const winnerCredibility = verdict.winner === 'Party A' ? verdict.credibility.partyA : verdict.credibility.partyB

  // Calculate "% wrong" (inverse of credibility)
  const wrongPercent = 100 - loserCredibility
  const isDraw = wrongPercent === 50

  // Get red flags for the loser
  const loserParty = verdict.winner === 'Party A' ? 'B' : 'A'
  const loserRedFlags = verdict.red_flags.filter(f => f.party === loserParty || f.party === (loserParty === 'A' ? partyAName : partyBName))

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return (
    <div className="min-h-screen bg-black">
      {/* ==================== MUGSHOT/SURVEILLANCE HEADER ==================== */}
      <div className="relative overflow-hidden">
        {/* Scan lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            )`,
          }}
        />

        {/* Red vignette - subtle */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: isDraw
              ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'
              : 'radial-gradient(ellipse at center, transparent 40%, rgba(127,29,29,0.25) 100%)',
          }}
        />

        {/* Corner timestamp - surveillance cam style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          className="absolute top-2 left-2 z-40 font-mono text-[10px] text-white/50"
        >
          <div className="text-red-500">REC ●</div>
          <div>{timestamp}</div>
          <div>CASE #{caseNumber}</div>
        </motion.div>

        {/* Evidence marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          className="absolute top-2 right-2 z-40"
        >
          <div className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wider">
            EVIDENCE
          </div>
        </motion.div>

        <div className="relative z-10 px-4 pt-12 pb-6">
          {/* Status badge - tilted like a stamp */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: phase >= 1 ? 1 : 0, rotate: phase >= 1 ? -12 : -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex justify-center mb-4"
          >
            <div
              className={`px-8 py-2 border-4 ${isDraw ? 'border-amber-500' : 'border-red-600'}`}
              style={{
                background: 'rgba(0,0,0,0.7)',
              }}
            >
              <span
                className={`text-2xl font-black tracking-[0.2em] ${isDraw ? 'text-amber-400' : 'text-red-500'}`}
                style={{
                  textShadow: isDraw
                    ? '0 0 10px rgba(245,158,11,0.5)'
                    : '0 0 10px rgba(220,38,38,0.5)',
                }}
              >
                {shameLabel}
              </span>
            </div>
          </motion.div>

          {/* Loser name - BIG, mugshot style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 30 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-2"
          >
            <h1
              className="text-white text-5xl sm:text-6xl font-black uppercase tracking-tight"
              style={{
                fontFamily: 'Impact, system-ui, sans-serif',
                textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
              }}
            >
              {loserName}
            </h1>
            <div className="text-white/30 text-xs font-mono tracking-widest mt-1">
              SUBJECT ID: {loserName?.toUpperCase().replace(/\s/g, '-')}-{caseNumber}
            </div>
          </motion.div>

          {/* "% WRONG" score - HUGE */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: phase >= 2 ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center mb-6 relative"
          >
            {/* Height marker lines */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
            <div className="absolute right-4 top-0 bottom-0 w-px bg-white/10" />

            <div className="text-red-500/60 text-xs font-mono tracking-[0.3em] mb-1">
              {isDraw ? 'VERDICT' : '% WRONG'}
            </div>
            <div
              className="text-8xl sm:text-9xl font-black leading-none"
              style={{
                background: isDraw
                  ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
                  : wrongPercent >= 75
                    ? 'linear-gradient(180deg, #dc2626 0%, #7f1d1d 100%)'
                    : 'linear-gradient(180deg, #f59e0b 0%, #dc2626 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: wrongPercent >= 75
                  ? 'drop-shadow(0 0 20px rgba(220,38,38,0.5))'
                  : 'drop-shadow(0 0 20px rgba(245,158,11,0.4))',
              }}
            >
              {isDraw ? '50/50' : `${wrongPercent}%`}
            </div>
          </motion.div>

          {/* Meme image with surveillance treatment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              {/* Frame with evidence tape corners */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-red-500/60" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-red-500/60" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-red-500/60" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-red-500/60" />

              {/* Image container - slightly taller for face focus */}
              <div
                className="w-44 h-48 overflow-hidden bg-red-950/50 relative"
                style={{
                  filter: 'grayscale(30%) contrast(1.1)',
                }}
              >
                {/* Fallback emoji - behind image */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <span className="text-6xl opacity-50">{wrongPercent >= 90 ? '💀' : wrongPercent >= 75 ? '😬' : wrongPercent >= 60 ? '😳' : '🤨'}</span>
                </div>
                {/* Image on top */}
                {shameImage && (
                  <img
                    src={shameImage}
                    alt="Reaction"
                    className="absolute inset-0 w-full h-full object-cover object-top z-10"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>

              {/* "EXHIBIT A" label */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-mono font-bold px-3 py-0.5">
                EXHIBIT A
              </div>
            </div>
          </motion.div>

          {/* Red Flags - styled like evidence list */}
          {loserRedFlags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
              className="mb-4"
            >
              <div className="text-red-500 text-xs font-mono tracking-wider mb-2 flex items-center gap-2">
                <span>▶</span> VIOLATIONS DOCUMENTED
              </div>
              <div className="space-y-2">
                {loserRedFlags.slice(0, 3).map((flag, i) => (
                  <div
                    key={i}
                    className="bg-red-950/20 border-l-2 border-red-500/70 px-3 py-2 font-mono"
                  >
                    <div className="text-white text-sm font-bold flex items-center gap-2">
                      <span className="text-red-500/70">[{String(i + 1).padStart(2, '0')}]</span>
                      {flag.flag}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">"{flag.evidence}"</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Manipulation Tactics */}
          {verdict.manipulation_tactics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-amber-500 text-xs font-mono tracking-wider mb-2 flex items-center gap-2">
                <span>▶</span> TACTICS IDENTIFIED
              </div>
              <div className="flex flex-wrap gap-2">
                {verdict.manipulation_tactics.map((tactic, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-xs font-mono font-bold ${
                      tactic.severity === 'high'
                        ? 'bg-red-900/50 text-red-300 border border-red-500/50'
                        : 'bg-amber-900/30 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {tactic.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Brutal divider - police tape style */}
      <div className="relative h-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #000 20px, #000 40px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black px-4 text-amber-400 text-xs font-black tracking-widest">
            CASE CLOSED
          </span>
        </div>
      </div>

      {/* ==================== WINNER SECTION (SECONDARY) ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        className="px-4 py-4 bg-gradient-to-b from-black to-green-950/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-green-500/60 text-[10px] font-mono tracking-[0.3em] mb-1">
              ✓ CLEARED
            </div>
            <h2 className="text-white/80 text-xl font-black uppercase tracking-tight">
              {winnerName}
            </h2>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-black font-mono"
              style={{
                color: '#22c55e',
              }}
            >
              {winnerCredibility}%
            </div>
            <div className="text-green-500/40 text-[10px] font-mono">CREDIBILITY</div>
          </div>
        </div>
      </motion.div>

      {/* ==================== ANALYSIS SECTIONS ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        className="px-4 pb-32"
      >
        {/* Toxicity */}
        <div className="py-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-xs font-mono tracking-wider">TOXICITY INDEX</span>
            <span className={`text-lg font-mono font-black ${verdict.toxicity >= 50 ? 'text-red-500' : 'text-white/50'}`}>
              {verdict.toxicity}%
            </span>
          </div>
          <div className="h-2 bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${verdict.toxicity}%` }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="h-full"
              style={{
                background: verdict.toxicity >= 70
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444, #dc2626)'
                  : verdict.toxicity >= 40
                  ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                  : '#6b7280',
              }}
            />
          </div>
        </div>

        {/* Evidence Log */}
        {verdict.evidence_log.length > 0 && (
          <div className="py-4 border-b border-white/10">
            <div className="text-blue-400 text-xs font-mono tracking-wider mb-3">
              ▶ EVIDENCE LOG
            </div>
            <div className="space-y-2">
              {verdict.evidence_log.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border-l-2 border-blue-500/50 px-3 py-2 font-mono"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-400 font-bold">EX-{item.exhibit}</span>
                    <span className={`${
                      item.favors === 'Party A' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      → {item.favors === 'Party A' ? partyAName : partyBName}
                    </span>
                  </div>
                  <div className="text-white/50 text-xs mt-0.5">{item.summary}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Judge's Ruling */}
        <div className="py-4 border-b border-white/10">
          <div className="text-yellow-500 text-xs font-mono tracking-wider mb-3">
            ▶ COURT RULING
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            {verdict.judges_opinion}
          </p>
        </div>

        {/* Recommendations */}
        <div className="py-4">
          <div className="text-purple-400 text-xs font-mono tracking-wider mb-3">
            ▶ COURT ORDERS
          </div>
          <div className="space-y-3">
            <div className="bg-red-950/20 border-l-2 border-red-500 px-3 py-2">
              <div className="text-red-400 text-xs font-mono font-bold mb-1">FOR {loserName?.toUpperCase()}:</div>
              <div className="text-white/50 text-sm">
                {verdict.winner === 'Party A' ? verdict.recommendations.partyB : verdict.recommendations.partyA}
              </div>
            </div>
            <div className="bg-green-950/20 border-l-2 border-green-500 px-3 py-2">
              <div className="text-green-400 text-xs font-mono font-bold mb-1">FOR {winnerName?.toUpperCase()}:</div>
              <div className="text-white/50 text-sm">
                {verdict.winner === 'Party A' ? verdict.recommendations.partyA : verdict.recommendations.partyB}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fixed bottom actions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 50 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pt-8 pb-6 px-4"
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/share')}
            className="flex-1 py-4 font-black text-sm tracking-wider text-white uppercase font-mono"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: '2px solid #dc2626',
            }}
          >
            EXPOSE THEM
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('evidence')
              sessionStorage.removeItem('verdict')
              navigate('/')
            }}
            className="px-6 py-4 text-white/40 hover:text-white/70 font-mono font-bold text-sm tracking-wider uppercase transition-colors border border-white/20"
          >
            NEW
          </button>
        </div>
      </motion.div>
    </div>
  )
}
