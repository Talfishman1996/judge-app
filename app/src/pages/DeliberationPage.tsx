import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { analyzeWithPrompt, type Evidence } from '../services/gemini'
import { saveCase } from '../services/database'

export default function DeliberationPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Initializing...')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [timestamp, setTimestamp] = useState('')

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

    // Check for evidence (sessionStorage first, localStorage as backup for iOS)
    const evidenceStr = sessionStorage.getItem('evidence') || localStorage.getItem('evidence')
    if (!evidenceStr) {
      navigate('/')
      return
    }

    let evidence: Evidence
    try {
      evidence = JSON.parse(evidenceStr)
    } catch (e) {
      console.error('Failed to parse evidence:', e)
      setError('Failed to load evidence data')
      return
    }

    // Call the real Gemini API
    const analyzeCase = async () => {
      try {
        setStatus('SCANNING EVIDENCE...')
        setProgress(10)
        await delay(800)

        setStatus('RUNNING CREDIBILITY ANALYSIS...')
        setProgress(25)
        await delay(600)

        setStatus('DETECTING MANIPULATION PATTERNS...')
        setProgress(40)

        const verdict = await analyzeWithPrompt(evidence)

        setStatus('CROSS-REFERENCING RED FLAGS...')
        setProgress(70)
        await delay(400)

        setStatus('COMPILING VERDICT...')
        setProgress(85)
        await delay(300)

        // Save to IndexedDB
        try {
          await saveCase(evidence, verdict)
        } catch (dbError) {
          console.error('Failed to save case to history:', dbError)
        }

        // Store verdict in session for display
        sessionStorage.setItem('verdict', JSON.stringify(verdict))
        localStorage.setItem('verdict', JSON.stringify(verdict))

        setStatus('VERDICT READY')
        setProgress(100)
        await delay(500)

        navigate('/verdict/brutalist')
      } catch (err) {
        console.error('Analysis failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to analyze evidence')
      }
    }

    analyzeCase()

    return () => {
      clearInterval(interval)
    }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
        {/* Scan lines */}
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

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-red-500 text-6xl mb-6 font-mono">!</div>
            <div
              className="px-6 py-2 border-2 border-red-600 inline-block mb-6"
              style={{ background: 'rgba(0,0,0,0.8)' }}
            >
              <span className="text-sm font-black tracking-[0.2em] text-red-500 font-mono">
                CASE DISMISSED
              </span>
            </div>
            <p className="text-white/60 mb-6 font-mono text-sm">{error}</p>

            {error.includes('API key') && (
              <button
                onClick={() => navigate('/settings')}
                className="w-full py-3 font-mono font-bold text-sm tracking-wider mb-4"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  border: '2px solid #dc2626',
                  color: 'white',
                }}
              >
                ADD API KEY
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="text-white/40 hover:text-white font-mono text-xs tracking-wider"
            >
              [BACK TO COURT]
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

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
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(127,29,29,0.2) 100%)',
        }}
      />

      {/* Corner timestamp */}
      <div className="absolute top-3 left-3 z-40 font-mono text-[10px] text-white/50">
        <div className="text-red-500 flex items-center gap-1">
          <span className="animate-pulse">●</span> PROCESSING
        </div>
        <div>{timestamp}</div>
        <div>DELIBERATION</div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Scales animation */}
        <motion.div
          className="text-amber-500 mb-8"
          animate={{
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32">
            <motion.path
              d="M50 10 L50 70 M30 70 L70 70"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <motion.circle
              cx="50"
              cy="10"
              r="6"
              fill="currentColor"
            />
            <motion.path
              d="M20 35 L30 70 M80 35 L70 70"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: [
                  "M20 35 L30 70 M80 35 L70 70",
                  "M25 40 L30 70 M75 30 L70 70",
                  "M20 35 L30 70 M80 35 L70 70"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.ellipse
              cx="20"
              cy="35"
              rx="15"
              ry="5"
              fill="currentColor"
              opacity="0.8"
              animate={{ cy: [35, 40, 35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="80"
              cy="35"
              rx="15"
              ry="5"
              fill="currentColor"
              opacity="0.8"
              animate={{ cy: [35, 30, 35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Status badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-4"
        >
          <div
            className="px-6 py-2 border-2 border-amber-500"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <span className="text-sm font-black tracking-[0.2em] text-amber-400 font-mono">
              DELIBERATING
            </span>
          </div>
        </motion.div>

        {/* Status text */}
        <motion.p
          className="text-white/60 font-mono text-sm text-center mb-8"
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status}
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-white/10 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #dc2626)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-white/40 text-[10px] font-mono mt-2">
          {progress}% COMPLETE
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative h-8 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #000 20px, #000 40px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black px-4 text-amber-400/60 text-[10px] font-mono tracking-widest">
            ANALYZING EVIDENCE
          </span>
        </div>
      </div>
    </div>
  )
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
