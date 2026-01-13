import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { clearAllCases, getCaseCount } from '../services/database'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState('')
  const [caseCount, setCaseCount] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load stored API key and case count asynchronously
    const loadSettings = async () => {
      const storedKey = localStorage.getItem('gemini_api_key')
      if (storedKey) {
        setApiKey(storedKey)
      }

      try {
        const count = await getCaseCount()
        setCaseCount(count)
      } catch (err) {
        console.error('Failed to get case count:', err)
      }
    }

    loadSettings()
  }, [])

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim())
    } else {
      localStorage.removeItem('gemini_api_key')
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearHistory = async () => {
    if (!confirm('Delete ALL case history? This cannot be undone.')) return

    try {
      await clearAllCases()
      setCaseCount(0)
      alert('All cases have been deleted.')
    } catch (err) {
      console.error('Failed to clear history:', err)
      alert('Failed to clear history.')
    }
  }

  return (
    <div className="min-h-screen bg-judge-black flex flex-col p-4 sm:p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-judge-gold text-2xl sm:text-3xl font-bold tracking-widest">
          SETTINGS
        </h1>
      </motion.div>

      {/* Settings List */}
      <motion.div
        className="max-w-lg mx-auto w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* API Key */}
        <div className="bg-judge-white/5 p-4">
          <div className="text-judge-gold font-bold tracking-wider mb-2">GEMINI API KEY</div>
          <div className="text-judge-white/60 text-sm mb-3">
            Get your free API key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-judge-purple hover:underline"
            >
              Google AI Studio
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key..."
              className="flex-1 bg-judge-black border border-judge-white/20 text-judge-white px-4 py-2 text-sm focus:border-judge-gold focus:outline-none"
            />
            <button
              onClick={saveApiKey}
              className={`px-4 py-2 text-sm font-bold tracking-wider transition-all ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-judge-gold text-judge-black hover:bg-judge-gold/80'
              }`}
            >
              {saved ? 'SAVED!' : 'SAVE'}
            </button>
          </div>
          <div className="text-judge-white/40 text-xs mt-2">
            Your API key is stored locally and never sent to our servers.
          </div>
        </div>

        {/* Clear History */}
        <div className="bg-judge-white/5 p-4 flex items-center justify-between">
          <div>
            <div className="text-judge-white font-bold tracking-wider">Clear Case History</div>
            <div className="text-judge-white/60 text-sm">
              {caseCount} case{caseCount !== 1 ? 's' : ''} on record
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            disabled={caseCount === 0}
            className={`border px-4 py-2 text-sm font-bold tracking-wider transition-all ${
              caseCount === 0
                ? 'border-judge-white/20 text-judge-white/40 cursor-not-allowed'
                : 'border-judge-red text-judge-red hover:bg-judge-red hover:text-white'
            }`}
          >
            CLEAR ALL
          </button>
        </div>

        {/* About */}
        <div className="bg-judge-white/5 p-4">
          <div className="text-judge-gold font-bold tracking-wider mb-2">ABOUT JUDGE</div>
          <p className="text-judge-white/60 text-sm leading-relaxed">
            JUDGE is an AI-powered courtroom that analyzes conversations and disputes
            to deliver honest, unbiased verdicts. Submit screenshots or text, and receive
            a detailed analysis including credibility scores, manipulation detection,
            and recommendations.
          </p>
          <p className="text-judge-white/60 text-sm leading-relaxed mt-3">
            Unlike other AI tools, JUDGE is designed to be <span className="text-judge-gold">brutally honest</span>.
            No sugarcoating. No validation seeking. Just the truth.
          </p>
          <div className="mt-4 pt-4 border-t border-judge-white/10">
            <p className="text-judge-white/40 text-xs">Version 1.0.0</p>
            <p className="text-judge-white/40 text-xs">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/history')}
            className="text-judge-white/60 hover:text-judge-white text-sm tracking-wider"
          >
            View History
          </button>
          <span className="text-judge-white/20">|</span>
          <button
            onClick={() => navigate('/')}
            className="text-judge-white/60 hover:text-judge-white text-sm tracking-wider"
          >
            New Case
          </button>
        </div>
      </motion.div>
    </div>
  )
}
