import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-judge-black flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* ALL RISE Header with dramatic entrance */}
      <motion.div
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-judge-gold text-4xl sm:text-6xl md:text-7xl font-bold tracking-ultrawide mb-4 text-shadow-glow"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          ALL RISE
        </motion.h1>
        <motion.p
          className="text-judge-white/60 text-base sm:text-lg tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          THE COURT IS NOW IN SESSION
        </motion.p>
      </motion.div>

      {/* Main Header */}
      <motion.h2
        className="text-judge-white text-xl sm:text-2xl md:text-3xl font-bold tracking-widest mb-8 sm:mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        PRESENT YOUR CASE
      </motion.h2>

      {/* Evidence Type Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.button
          onClick={() => navigate('/upload')}
          className="flex-1 bg-transparent border-2 border-judge-gold text-judge-gold py-4 px-6 sm:px-8 text-base sm:text-lg font-bold tracking-wider hover:bg-judge-gold hover:text-judge-black transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          UPLOAD SCREENSHOTS
        </motion.button>
        <motion.button
          onClick={() => navigate('/text')}
          className="flex-1 bg-transparent border-2 border-judge-purple text-judge-purple py-4 px-6 sm:px-8 text-base sm:text-lg font-bold tracking-wider hover:bg-judge-purple hover:text-judge-black transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          PASTE TEXT
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="text-judge-white/40 text-xs sm:text-sm mt-12 sm:mt-16 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        Justice will be served
      </motion.p>
    </div>
  )
}
