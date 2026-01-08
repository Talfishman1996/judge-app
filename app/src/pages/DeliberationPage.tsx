import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { analyzeWithPrompt, type Evidence } from '../services/gemini'
import { saveCase } from '../services/database'

export default function DeliberationPage() {
  const navigate = useNavigate()
  const [dots, setDots] = useState('')
  const [status, setStatus] = useState('Analyzing evidence...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Animate the dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    // Check for evidence
    const evidenceStr = sessionStorage.getItem('evidence')
    if (!evidenceStr) {
      navigate('/')
      return
    }

    const evidence: Evidence = JSON.parse(evidenceStr)

    // Call the real Gemini API
    const analyzeCase = async () => {
      try {
        setStatus('Reading the evidence...')
        await delay(1000)

        setStatus('Assessing credibility...')
        await delay(500)

        setStatus('Detecting manipulation tactics...')

        const verdict = await analyzeWithPrompt(evidence)

        setStatus('Preparing verdict...')
        await delay(500)

        // Save to IndexedDB
        try {
          await saveCase(evidence, verdict)
        } catch (dbError) {
          console.error('Failed to save case to history:', dbError)
          // Continue even if save fails
        }

        // Store verdict in session for display
        sessionStorage.setItem('verdict', JSON.stringify(verdict))

        navigate('/verdict')
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
      <div className="min-h-screen bg-judge-black flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-judge-red text-6xl mb-6">!</div>
          <h1 className="text-judge-red text-2xl font-bold tracking-widest mb-4">
            CASE DISMISSED
          </h1>
          <p className="text-judge-white/80 mb-6">{error}</p>

          {error.includes('API key') && (
            <button
              onClick={() => navigate('/settings')}
              className="bg-judge-gold text-judge-black px-6 py-3 font-bold tracking-wider hover:bg-judge-gold/80 transition-colors mb-4"
            >
              ADD API KEY
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="block mx-auto text-judge-white/60 hover:text-judge-white text-sm tracking-wider"
          >
            &larr; BACK TO COURT
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-judge-black flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Scales of Justice Animation */}
      <motion.div
        className="text-judge-gold text-8xl mb-8"
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
          {/* Left plate */}
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
          {/* Right plate */}
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

      {/* Header */}
      <motion.h1
        className="text-judge-gold text-2xl sm:text-4xl font-bold tracking-widest text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        THE JUDGE IS DELIBERATING{dots}
      </motion.h1>

      {/* Status */}
      <motion.p
        className="text-judge-white/60 text-sm sm:text-base text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        key={status}
      >
        {status}
      </motion.p>

      {/* Indeterminate progress bar */}
      <motion.div
        className="w-64 h-1 bg-judge-white/20 mt-8 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.div
          className="h-full w-1/3 bg-judge-gold"
          animate={{
            x: ['-100%', '300%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  )
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
