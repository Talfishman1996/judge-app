import { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function TextInputPage() {
  const navigate = useNavigate()
  const [conversation, setConversation] = useState('')
  const [partyA, setPartyA] = useState('')
  const [partyB, setPartyB] = useState('')
  const [context, setContext] = useState('')

  const isValid = conversation.trim().length >= 50 && partyA.trim() && partyB.trim()

  const handleSubmit = () => {
    if (!isValid) return

    sessionStorage.setItem('evidence', JSON.stringify({
      type: 'text',
      conversation,
      partyA,
      partyB,
      context
    }))

    navigate('/deliberation')
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
        <button
          onClick={() => navigate('/')}
          className="text-judge-white/60 hover:text-judge-white mb-4 text-sm tracking-wider"
        >
          &larr; BACK TO COURT
        </button>
        <h1 className="text-judge-gold text-2xl sm:text-3xl font-bold tracking-widest">
          ENTER TESTIMONY
        </h1>
        <p className="text-judge-white/60 text-sm mt-2">
          Paste the conversation for judgment
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        className="flex-1 max-w-3xl mx-auto w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Party Names */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-judge-gold text-sm font-bold tracking-wider mb-2">
              PARTY A (First Person)
            </label>
            <input
              type="text"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              placeholder="e.g., Alex"
              className="w-full bg-judge-white/5 border border-judge-white/20 text-judge-white px-4 py-3 focus:border-judge-gold focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-judge-purple text-sm font-bold tracking-wider mb-2">
              PARTY B (Second Person)
            </label>
            <input
              type="text"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              placeholder="e.g., Jordan"
              className="w-full bg-judge-white/5 border border-judge-white/20 text-judge-white px-4 py-3 focus:border-judge-purple focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Conversation */}
        <div>
          <label className="block text-judge-white text-sm font-bold tracking-wider mb-2">
            THE CONVERSATION
          </label>
          <textarea
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            placeholder="Paste the conversation here. Include who said what for best results..."
            className="w-full h-64 bg-judge-white/5 border border-judge-white/20 text-judge-white px-4 py-3 focus:border-judge-gold focus:outline-none transition-colors resize-none"
          />
          <div className="text-right text-judge-white/40 text-xs mt-1">
            {conversation.length} characters {conversation.length < 50 && '(minimum 50)'}
          </div>
        </div>

        {/* Additional Context */}
        <div>
          <label className="block text-judge-white/60 text-sm font-bold tracking-wider mb-2">
            ADDITIONAL CONTEXT (optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Any backstory or context the court should know..."
            className="w-full h-24 bg-judge-white/5 border border-judge-white/20 text-judge-white px-4 py-3 focus:border-judge-white/40 focus:outline-none transition-colors resize-none"
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`px-8 py-4 text-lg font-bold tracking-widest transition-all duration-300 ${
            isValid
              ? 'bg-judge-gold text-judge-black hover:bg-judge-gold/80'
              : 'bg-judge-white/20 text-judge-white/40 cursor-not-allowed'
          }`}
        >
          PROCEED TO JUDGMENT
        </button>
      </motion.div>
    </div>
  )
}
