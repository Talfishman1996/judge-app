import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function TextInputPage() {
  const navigate = useNavigate()
  const [conversation, setConversation] = useState('')
  const [partyA, setPartyA] = useState('')
  const [partyB, setPartyB] = useState('')
  const [context, setContext] = useState('')
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
    return () => clearInterval(interval)
  }, [])

  const isValid = conversation.trim().length >= 50 && partyA.trim() && partyB.trim()

  const handleSubmit = () => {
    if (!isValid) return

    const payload = {
      type: 'text',
      conversation,
      partyA,
      partyB,
      context
    }

    sessionStorage.setItem('evidence', JSON.stringify(payload))
    localStorage.setItem('evidence', JSON.stringify(payload))

    navigate('/deliberation')
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

      {/* Corner timestamp */}
      <div className="absolute top-3 left-3 z-40 font-mono text-[10px] text-white/50">
        <div className="text-red-500 flex items-center gap-1">
          <span className="animate-pulse">●</span> REC
        </div>
        <div>{timestamp}</div>
        <div>TEXT INTAKE</div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-3 right-3 z-40 text-white/30 hover:text-white text-[10px] font-mono tracking-wider transition-colors"
      >
        [BACK]
      </button>

      {/* Header */}
      <div className="pt-16 pb-4 px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="inline-block mb-4"
        >
          <div
            className="px-6 py-2 border-2 border-amber-500"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <span className="text-sm font-black tracking-[0.2em] text-amber-400 font-mono">
              ENTER TESTIMONY
            </span>
          </div>
        </motion.div>

        <p className="text-white/40 text-xs font-mono tracking-wider">
          PASTE THE CONVERSATION FOR JUDGMENT
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <motion.div
          className="max-w-2xl mx-auto w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Party Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-500 text-[10px] font-mono font-bold tracking-wider mb-2">
                ▶ PARTY A (PLAINTIFF)
              </label>
              <input
                type="text"
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                placeholder="Name..."
                className="w-full bg-black border-2 border-white/20 text-white px-4 py-3 font-mono focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-red-500 text-[10px] font-mono font-bold tracking-wider mb-2">
                ▶ PARTY B (DEFENDANT)
              </label>
              <input
                type="text"
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                placeholder="Name..."
                className="w-full bg-black border-2 border-white/20 text-white px-4 py-3 font-mono focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Conversation */}
          <div>
            <label className="block text-white/60 text-[10px] font-mono font-bold tracking-wider mb-2">
              ▶ THE CONVERSATION
            </label>
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder="Paste the conversation here. Include who said what for best results..."
              className="w-full h-48 bg-black border-2 border-white/20 text-white px-4 py-3 font-mono text-sm focus:border-amber-500 focus:outline-none transition-colors resize-none"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1">
              <span className={conversation.length < 50 ? 'text-red-500' : 'text-green-500'}>
                {conversation.length < 50 ? `${50 - conversation.length} MORE CHARS NEEDED` : 'MINIMUM MET'}
              </span>
              <span className="text-white/40">{conversation.length} CHARS</span>
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-white/40 text-[10px] font-mono font-bold tracking-wider mb-2">
              ▶ ADDITIONAL CONTEXT (OPTIONAL)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Any backstory or context the court should know..."
              className="w-full h-20 bg-black border-2 border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-white/30 focus:outline-none transition-colors resize-none"
            />
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 font-black text-sm tracking-wider uppercase font-mono transition-all duration-200 ${
            isValid
              ? 'hover:scale-[1.02] active:scale-[0.98]'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: isValid
              ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
              : 'rgba(255,255,255,0.1)',
            border: isValid
              ? '2px solid #dc2626'
              : '2px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          PROCEED TO JUDGMENT
        </button>
      </div>
    </div>
  )
}
