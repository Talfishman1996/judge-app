import { motion } from 'motion/react'
import { useNavigate, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-judge-black flex flex-col">
      {/* Navigation Bar - show on all pages except home */}
      {!isHome && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-judge-black/90 backdrop-blur-sm border-b border-judge-white/10"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-judge-gold font-bold tracking-wider text-sm hover:text-judge-gold/80 transition-colors"
            >
              JUDGE
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/history')}
                className={`text-sm tracking-wider transition-colors ${
                  location.pathname === '/history'
                    ? 'text-judge-gold'
                    : 'text-judge-white/60 hover:text-judge-white'
                }`}
              >
                History
              </button>
              <button
                onClick={() => navigate('/settings')}
                className={`text-sm tracking-wider transition-colors ${
                  location.pathname === '/settings'
                    ? 'text-judge-gold'
                    : 'text-judge-white/60 hover:text-judge-white'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Page Content with transition */}
      <motion.main
        className={`flex-1 ${!isHome ? 'pt-14' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
