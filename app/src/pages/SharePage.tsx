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

type Theme = 'black' | 'gold' | 'purple' | 'red'

const themes: Record<Theme, { bg: string; accent: string; text: string }> = {
  black: { bg: '#000000', accent: '#D4A843', text: '#FFFFFF' },
  gold: { bg: '#1a1500', accent: '#D4A843', text: '#FFFFFF' },
  purple: { bg: '#1a0a2e', accent: '#8B5CF6', text: '#FFFFFF' },
  red: { bg: '#1a0505', accent: '#FF3B3B', text: '#FFFFFF' }
}

export default function SharePage() {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [theme, setTheme] = useState<Theme>('black')
  const [isGenerating, setIsGenerating] = useState(false)
  const [partyAName, setPartyAName] = useState('Party A')
  const [partyBName, setPartyBName] = useState('Party B')

  useEffect(() => {
    const verdictData = sessionStorage.getItem('verdict')
    const evidenceData = sessionStorage.getItem('evidence')

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
  }, [navigate])

  const downloadCard = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: themes[theme].bg
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
        backgroundColor: themes[theme].bg
      })

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])

      alert('Verdict card copied to clipboard!')
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
        backgroundColor: themes[theme].bg
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

  const currentTheme = themes[theme]
  const winnerName = verdict.winner === 'Party A' ? partyAName :
                     verdict.winner === 'Party B' ? partyBName : 'DRAW'

  return (
    <div className="min-h-screen bg-judge-black p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/verdict')}
            className="text-judge-white/60 hover:text-judge-white mb-4 text-sm tracking-wider"
          >
            &larr; BACK TO VERDICT
          </button>
          <h1 className="text-judge-gold text-2xl sm:text-3xl font-bold tracking-widest">
            SHARE VERDICT
          </h1>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {(Object.keys(themes) as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                theme === t ? 'scale-110 border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: themes[t].accent }}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            />
          ))}
        </motion.div>

        {/* Card Preview */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div
            ref={cardRef}
            className="p-8 rounded-lg"
            style={{ backgroundColor: currentTheme.bg }}
          >
            {/* Card Header */}
            <div className="text-center mb-6">
              <div
                className="text-xs tracking-widest mb-2 opacity-60"
                style={{ color: currentTheme.text }}
              >
                THE COURT HAS RULED
              </div>
              <div
                className="text-4xl sm:text-5xl font-bold tracking-wider"
                style={{ color: currentTheme.accent }}
              >
                {winnerName.toUpperCase()}
              </div>
              {verdict.winner !== 'Draw' && (
                <div
                  className="text-lg mt-1"
                  style={{ color: currentTheme.text }}
                >
                  PREVAILS
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.accent }}
                >
                  {verdict.credibility.partyA}%
                </div>
                <div
                  className="text-xs opacity-60"
                  style={{ color: currentTheme.text }}
                >
                  {partyAName}
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: '#FF3B3B' }}
                >
                  {verdict.toxicity}%
                </div>
                <div
                  className="text-xs opacity-60"
                  style={{ color: currentTheme.text }}
                >
                  TOXICITY
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.accent }}
                >
                  {verdict.credibility.partyB}%
                </div>
                <div
                  className="text-xs opacity-60"
                  style={{ color: currentTheme.text }}
                >
                  {partyBName}
                </div>
              </div>
            </div>

            {/* Verdict Summary */}
            <div
              className="text-center text-sm opacity-80 mb-6"
              style={{ color: currentTheme.text }}
            >
              "{verdict.winner_reason}"
            </div>

            {/* Footer */}
            <div
              className="text-center text-xs tracking-widest opacity-40"
              style={{ color: currentTheme.text }}
            >
              JUDGED BY AI • JUSTICE SERVED
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={downloadCard}
            disabled={isGenerating}
            className="bg-judge-gold text-judge-black px-6 py-3 font-bold tracking-wider hover:bg-judge-gold/80 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'GENERATING...' : 'DOWNLOAD PNG'}
          </button>
          <button
            onClick={copyToClipboard}
            disabled={isGenerating}
            className="border border-judge-white/30 text-judge-white px-6 py-3 font-bold tracking-wider hover:bg-judge-white/10 transition-colors disabled:opacity-50"
          >
            COPY TO CLIPBOARD
          </button>
          <button
            onClick={shareNative}
            disabled={isGenerating}
            className="border border-judge-purple text-judge-purple px-6 py-3 font-bold tracking-wider hover:bg-judge-purple/10 transition-colors disabled:opacity-50"
          >
            SHARE
          </button>
        </motion.div>

        {/* Back to New Case */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => {
              sessionStorage.removeItem('evidence')
              sessionStorage.removeItem('verdict')
              navigate('/')
            }}
            className="text-judge-white/60 hover:text-judge-white text-sm tracking-wider"
          >
            FILE A NEW CASE
          </button>
        </motion.div>
      </div>
    </div>
  )
}
