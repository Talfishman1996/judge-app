import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const [timestamp, setTimestamp] = useState('')
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Update timestamp
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

    // Phase animations
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 1000),
    ]

    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [])

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

      {/* Corner timestamp - surveillance cam style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        className="absolute top-3 left-3 z-40 font-mono text-[10px] text-white/50"
      >
        <div className="text-red-500 flex items-center gap-1">
          <span className="animate-pulse">●</span> LIVE
        </div>
        <div>{timestamp}</div>
        <div>CAM-01</div>
      </motion.div>

      {/* Nav links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        className="absolute top-3 right-3 z-40 flex gap-3"
      >
        <button
          onClick={() => navigate('/history')}
          className="text-white/30 hover:text-white text-[10px] font-mono tracking-wider transition-colors"
        >
          [HISTORY]
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="text-white/30 hover:text-white text-[10px] font-mono tracking-wider transition-colors"
        >
          [CONFIG]
        </button>
        <button
          onClick={() => navigate('/test')}
          className="text-white/30 hover:text-white text-[10px] font-mono tracking-wider transition-colors"
        >
          [TEST]
        </button>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Status badge */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: phase >= 1 ? 1 : 0, rotate: phase >= 1 ? -6 : -30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="mb-6"
        >
          <div
            className="px-6 py-2 border-2 border-amber-500"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <span
              className="text-sm font-black tracking-[0.2em] text-amber-400 font-mono"
              style={{ textShadow: '0 0 10px rgba(245,158,11,0.5)' }}
            >
              COURT IN SESSION
            </span>
          </div>
        </motion.div>

        {/* ALL RISE - Big, impactful */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 30 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <h1
            className="text-white text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight"
            style={{
              fontFamily: 'Impact, system-ui, sans-serif',
              textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
            }}
          >
            ALL RISE
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          className="text-white/40 text-xs font-mono tracking-[0.3em] mb-12"
        >
          THE JUDGE WILL SEE YOU NOW
        </motion.div>

        {/* Action buttons - brutalist style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
          className="w-full max-w-sm space-y-3"
        >
          {/* Upload button */}
          <button
            onClick={() => navigate('/upload')}
            className="w-full py-5 font-black text-sm tracking-wider uppercase font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: '2px solid #dc2626',
              color: 'white',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">📸</span>
              <span>UPLOAD SCREENSHOTS</span>
            </div>
            <div className="text-white/50 text-[10px] mt-1 font-normal">
              Submit visual evidence
            </div>
          </button>

          {/* Text input button */}
          <button
            onClick={() => navigate('/text')}
            className="w-full py-5 font-black text-sm tracking-wider uppercase font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">📝</span>
              <span>PASTE CONVERSATION</span>
            </div>
            <div className="text-white/40 text-[10px] mt-1 font-normal">
              Copy/paste text evidence
            </div>
          </button>
        </motion.div>

        {/* Compare option */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          onClick={() => navigate('/compare')}
          className="mt-6 text-white/30 hover:text-white/60 text-xs font-mono tracking-wider transition-colors"
        >
          [COMPARE VERDICTS]
        </motion.button>
      </div>

      {/* Bottom bar - police tape style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        className="relative h-8 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #000 20px, #000 40px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black px-4 text-amber-400/60 text-[10px] font-mono tracking-widest">
            JUSTICE WILL BE SERVED
          </span>
        </div>
      </motion.div>
    </div>
  )
}
