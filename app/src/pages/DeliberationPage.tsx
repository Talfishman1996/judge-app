import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { analyzeWithPrompt, type Evidence } from '../services/gemini'
import { saveCase, getTempEvidence } from '../services/database'

const STATUS_MESSAGES = [
  "REVIEWING EVIDENCE...",
  "CROSS-EXAMINING TESTIMONY...",
  "DETECTING MANIPULATION PATTERNS...",
  "ANALYZING POWER DYNAMICS...",
  "WEIGHING CREDIBILITY...",
  "SCANNING FOR RED FLAGS...",
  "EVALUATING TONE AND INTENT...",
  "CONSULTING LEGAL PRECEDENT...",
  "PREPARING VERDICT..."
]

const ANALYSIS_DURATION_MS = 10000
const STATUS_CHANGE_INTERVAL_MS = 2000

export default function DeliberationPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(STATUS_MESSAGES[0])
  const [error, setError] = useState<string | null>(null)
  const [isMistrial, setIsMistrial] = useState(false)
  const [progress, setProgress] = useState(0)
  const statusIndexRef = useRef<number>(0)
  const progressIntervalRef = useRef<number | null>(null)
  const statusIntervalRef = useRef<number | null>(null)

  const clearIntervals = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current)
      statusIntervalRef.current = null
    }
  }, [])

  const startAnalysis = useCallback(async () => {
    setError(null)
    setIsMistrial(false)
    setProgress(0)
    statusIndexRef.current = 0
    setStatus(STATUS_MESSAGES[0])

    let evidence: Evidence | null = null

    try {
      evidence = await getTempEvidence()
    } catch (e) {
      console.error('Failed to get evidence from IndexedDB:', e)
    }

    if (!evidence) {
      const evidenceStr = sessionStorage.getItem('evidence') || localStorage.getItem('evidence')
      if (evidenceStr) {
        try {
          evidence = JSON.parse(evidenceStr)
        } catch (e) {
          console.error('Failed to parse evidence:', e)
        }
      }
    }

    if (!evidence) {
      navigate('/')
      return
    }

    const startTime = Date.now()
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / ANALYSIS_DURATION_MS) * 100, 99)
      setProgress(Math.round(newProgress))
    }, 50)

    statusIntervalRef.current = window.setInterval(() => {
      statusIndexRef.current = (statusIndexRef.current + 1) % STATUS_MESSAGES.length
      setStatus(STATUS_MESSAGES[statusIndexRef.current])
    }, STATUS_CHANGE_INTERVAL_MS)

    try {
      const verdict = await analyzeWithPrompt(evidence)

      clearIntervals()

      try {
        await saveCase(evidence, verdict)
      } catch (dbError) {
        console.error('Failed to save case to history:', dbError)
      }

      sessionStorage.setItem('verdict', JSON.stringify(verdict))

      setStatus('VERDICT READY')
      setProgress(100)
      await delay(500)

      navigate('/verdict')
    } catch (err) {
      clearIntervals()
      console.error('Analysis failed:', err)
      setIsMistrial(true)
      setError(err instanceof Error ? err.message : 'Failed to analyze evidence')
    }
  }, [navigate, clearIntervals])

  useEffect(() => {
    startAnalysis()

    return () => {
      clearIntervals()
    }
  }, [startAnalysis, clearIntervals])

  const handleCancel = () => {
    clearIntervals()
    navigate(-1)
  }

  const handleRetry = () => {
    startAnalysis()
  }

  if (isMistrial && error) {
    return (
      <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-red-500 text-6xl mb-6 font-mono"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              !!
            </motion.div>
            <div
              className="px-6 py-2 border-2 border-red-600 inline-block mb-6"
              style={{ background: 'rgba(0,0,0,0.8)' }}
            >
              <span className="text-sm font-black tracking-[0.2em] text-red-500 font-mono">
                MISTRIAL
              </span>
            </div>
            <p className="text-white/60 mb-2 font-mono text-sm">The court has encountered an error.</p>
            <p className="text-white/40 mb-8 font-mono text-xs">{error}</p>

            <button
              onClick={handleRetry}
              className="w-full py-3 font-mono font-bold text-sm tracking-wider mb-4"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                border: '2px solid #dc2626',
                color: 'white',
              }}
            >
              RETRY DELIBERATION
            </button>

            {error.includes('API key') && (
              <button
                onClick={() => navigate('/settings')}
                className="w-full py-3 font-mono font-bold text-sm tracking-wider mb-4"
                style={{
                  background: 'transparent',
                  border: '2px solid #facc15',
                  color: '#facc15',
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

  if (error && !isMistrial) {
    return (
      <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
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
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={handleCancel}
          className="text-white/40 hover:text-white font-mono text-xs tracking-wider px-3 py-2 border border-white/20 hover:border-white/40 transition-colors"
        >
          [CANCEL]
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <h1 className="text-white font-bold tracking-widest uppercase text-lg sm:text-xl mb-8">
          JUDGE IS DELIBERATING
        </h1>

        <motion.div
          className="mb-8"
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
              stroke="#dc2626"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <motion.circle cx="50" cy="10" r="6" fill="#dc2626" />
            <motion.path
              d="M20 35 L30 70 M80 35 L70 70"
              stroke="#facc15"
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
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse cx="20" cy="35" rx="15" ry="5" fill="#dc2626" opacity="0.8"
              animate={{ cy: [35, 40, 35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse cx="80" cy="35" rx="15" ry="5" fill="#facc15" opacity="0.8"
              animate={{ cy: [35, 30, 35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-6 rounded-sm w-full max-w-md mb-8"
        >
          <motion.p
            className="text-white/80 font-mono text-sm text-center"
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {status}
          </motion.p>
        </motion.div>

        <div className="w-full max-w-md">
          <div className="w-full h-2 bg-white/10 overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #dc2626, #facc15)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          <div className="text-white/40 text-[10px] font-mono mt-2 text-center">
            {progress}% COMPLETE
          </div>
        </div>
      </div>
    </div>
  )
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
