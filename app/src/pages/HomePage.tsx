import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Phase animations
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
    ]

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [])

  const evidenceTypes = [
    {
      id: 'screenshots',
      title: 'SCREENSHOTS',
      description: 'Upload visual evidence from conversations',
      icon: '📸',
      path: '/upload',
      primary: true,
    },
    {
      id: 'text',
      title: 'TEXT',
      description: 'Paste conversation text directly',
      icon: '📝',
      path: '/text',
      primary: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -20 }}
        transition={{ duration: 0.4 }}
        className="p-6 border-b border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold tracking-widest text-xl uppercase">
              JUDGE
            </h1>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mt-1">
              AI COURTROOM
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/history')}
              className="text-white/60 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              HISTORY
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="text-white/60 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              SETTINGS
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-white text-5xl md:text-6xl font-bold tracking-widest uppercase mb-4">
              PRESENT YOUR CASE
            </h1>
            <p className="text-white/60 text-sm font-bold tracking-widest uppercase">
              Select evidence type to begin
            </p>
          </motion.div>

          {/* Evidence Type Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            {evidenceTypes.map((type, index) => (
              <motion.button
                key={type.id}
                onClick={() => navigate(type.path)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-8 rounded-xl border transition-all duration-200 ${
                  type.primary
                    ? 'bg-[#facc15] border-[#facc15] text-black'
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                }`}
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3
                  className={`text-xl font-bold tracking-widest uppercase mb-2 ${
                    type.primary ? 'text-black' : 'text-white'
                  }`}
                >
                  {type.title}
                </h3>
                <p
                  className={`text-sm ${
                    type.primary ? 'text-black/60' : 'text-white/60'
                  }`}
                >
                  {type.description}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6 border-t border-white/10"
      >
        <div className="text-center">
          <p className="text-white/60 text-xs font-bold tracking-widest uppercase">
            JUSTICE WILL BE SERVED
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
