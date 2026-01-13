import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'

interface Verdict {
  winner: string
  winner_reason: string
  credibility: {
    partyA: number
    partyB: number
  }
  toxicity: number
  judges_opinion: string
}

export default function SharePage() {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [partyAName, setPartyAName] = useState('Party A')
  const [partyBName, setPartyBName] = useState('Party B')
  const [timestamp, setTimestamp] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      setTimestamp(new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    const verdictData = sessionStorage.getItem('verdict') || localStorage.getItem('verdict')
    const evidenceData = sessionStorage.getItem('evidence') || localStorage.getItem('evidence')

    if (!verdictData) {
      navigate('/')
      return
    }

    setVerdict(JSON.parse(verdictData))

    if (evidenceData) {
      const evidence = JSON.parse(evidenceData)
      if (evidence.partyA) setPartyAName(evidence.partyA)
      if (evidence.partyB) setPartyBName(evidence.partyB)
    }

    return () => clearInterval(interval)
  }, [navigate])

  const downloadCard = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000'
      })

      const link = document.createElement('a')
      link.download = `judge-verdict-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate image:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000'
      })

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy. Try downloading instead.')
    } finally {
      setIsGenerating(false)
    }
  }

  const shareNative = async () => {
    if (!cardRef.current) return

    if (!navigator.share) {
      alert('Sharing not supported on this device. Try downloading instead.')
      return
    }

    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000'
      })

      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], 'judge-verdict.png', { type: 'image/png' })

      await navigator.share({
        title: 'JUDGE Verdict',
        text: `The verdict is in: ${verdict?.winner === 'Party A' ? partyAName : verdict?.winner === 'Party B' ? partyBName : 'Draw'}`,
        files: [file]
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to share:', err)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  if (!verdict) return null

  const winnerName = verdict.winner === 'Party A' ? partyAName :
                     verdict.winner === 'Party B' ? partyBName : 'DRAW'
  const loserName = verdict.winner === 'Party A' ? partyBName :
                    verdict.winner === 'Party B' ? partyAName : null

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
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

      {/* Red vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(127,29,29,0.15) 100%)',
        }}
      />

      {/* Corner timestamp */}
      <div className="absolute top-3 left-3 z-40 font-mono text-[10px] text-white/50">
        <div className="text-red-500 flex items-center gap-1">
          <span className="animate-pulse">●</span> EXPORT
        </div>
        <div>{timestamp}</div>
        <div>SHARE MODE</div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/verdict')}
        className="absolute top-3 right-3 z-40 text-white/30 hover:text-white text-[10px] font-mono tracking-wider transition-colors"
      >
        [BACK]
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="mb-6"
        >
          <div
            className="px-6 py-2 border-2 border-amber-500"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <span className="text-sm font-black tracking-[0.2em] text-amber-400 font-mono">
              EXPORT VERDICT
            </span>
          </div>
        </motion.div>

        {/* Card Preview */}
        <motion.div
          className="mb-8 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            ref={cardRef}
            className="p-6 border-2 border-white/20"
            style={{ backgroundColor: '#000000' }}
          >
            {/* Corner brackets */}
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-red-500" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-red-500" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-red-500" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-red-500" />

              {/* Card Header */}
              <div className="text-center mb-4 pt-2">
                <div className="text-white/40 text-[10px] font-mono tracking-widest mb-2">
                  THE COURT HAS RULED
                </div>
                <div className="text-amber-400 text-3xl font-black font-mono tracking-wider">
                  {winnerName.toUpperCase()}
                </div>
                {verdict.winner !== 'Draw' && (
                  <div className="text-green-500 text-sm font-mono font-bold mt-1">
                    PREVAILS
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20 my-4" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-green-400 text-xl font-black font-mono">
                    {verdict.credibility.partyA}%
                  </div>
                  <div className="text-white/40 text-[10px] font-mono truncate">
                    {partyAName}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-red-500 text-xl font-black font-mono">
                    {verdict.toxicity}%
                  </div>
                  <div className="text-white/40 text-[10px] font-mono">
                    TOXICITY
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 text-xl font-black font-mono">
                    {verdict.credibility.partyB}%
                  </div>
                  <div className="text-white/40 text-[10px] font-mono truncate">
                    {partyBName}
                  </div>
                </div>
              </div>

              {/* Verdict Summary */}
              {loserName && (
                <div className="bg-red-900/20 border border-red-500/30 p-3 mb-4">
                  <div className="text-red-500 text-[10px] font-mono font-bold mb-1">
                    GUILTY PARTY: {loserName.toUpperCase()}
                  </div>
                  <div className="text-white/60 text-xs font-mono leading-relaxed">
                    "{verdict.winner_reason}"
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono pb-2">
                <span className="text-white/30">CASE #{Date.now().toString().slice(-6)}</span>
                <span className="text-amber-400/60 tracking-widest">JUDGED BY AI</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="w-full max-w-md space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Share button (primary) */}
          <button
            onClick={shareNative}
            disabled={isGenerating}
            className="w-full py-4 font-black text-sm tracking-wider uppercase font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: '2px solid #dc2626',
              color: 'white',
            }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse">●</span> GENERATING...
              </span>
            ) : (
              'SHARE VERDICT'
            )}
          </button>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadCard}
              disabled={isGenerating}
              className="py-3 font-bold text-xs tracking-wider uppercase font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
              }}
            >
              DOWNLOAD
            </button>
            <button
              onClick={copyToClipboard}
              disabled={isGenerating}
              className="py-3 font-bold text-xs tracking-wider uppercase font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.3)',
                color: copied ? '#22c55e' : 'white',
              }}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </motion.div>

        {/* New Case link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            sessionStorage.removeItem('evidence')
            sessionStorage.removeItem('verdict')
            localStorage.removeItem('evidence')
            localStorage.removeItem('verdict')
            navigate('/')
          }}
          className="mt-8 text-white/30 hover:text-white/60 text-xs font-mono tracking-wider transition-colors"
        >
          [FILE NEW CASE]
        </motion.button>
      </div>

      {/* Bottom bar - police tape style */}
      <div className="relative h-8 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #000 20px, #000 40px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black px-4 text-amber-400/60 text-[10px] font-mono tracking-widest">
            VERDICT EXPORTED
          </span>
        </div>
      </div>
    </div>
  )
}
