import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { getAllCases, deleteCase, type SavedCase } from '../services/database'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [cases, setCases] = useState<SavedCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      const allCases = await getAllCases()
      setCases(allCases)
    } catch (err) {
      console.error('Failed to load cases:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this case from history?')) return

    try {
      await deleteCase(id)
      setCases(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete case:', err)
    }
  }

  const viewCase = (caseData: SavedCase) => {
    // Load the case data into session storage and navigate to verdict
    sessionStorage.setItem('evidence', JSON.stringify(caseData.evidence))
    sessionStorage.setItem('verdict', JSON.stringify(caseData.verdict))
    navigate('/verdict')
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 sm:p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-widest uppercase">
          CASE HISTORY
        </h1>
        <p className="text-white/60 text-xs font-bold tracking-widest uppercase mt-2">
          {cases.length} CASE{cases.length !== 1 ? 'S' : ''} ON RECORD
        </p>
      </motion.div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/40">Loading cases...</div>
        </div>
      ) : cases.length === 0 ? (
        /* Empty State */
        <motion.div
          className="flex-1 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-white/20 text-6xl mb-4">
            <svg viewBox="0 0 24 24" className="w-24 h-24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
          </div>
          <p className="text-white/40 text-lg tracking-wider mb-2 uppercase font-bold">NO CASES ON RECORD</p>
          <p className="text-white/30 text-sm">Your verdict history will appear here</p>

          <button
            onClick={() => navigate('/')}
            className="mt-8 border border-judge-gold text-judge-gold px-6 py-3 font-bold tracking-wider uppercase hover:bg-judge-gold hover:text-black transition-all"
          >
            FILE A NEW CASE
          </button>
        </motion.div>
      ) : (
        /* Case List */
        <motion.div
          className="flex-1 max-w-2xl mx-auto w-full space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {cases.map((caseData, index) => {
            const isWinner = (party: 'A' | 'B') => {
              if (caseData.verdict.winner === 'Draw') return false
              return (party === 'A' && caseData.verdict.winner === 'Party A') ||
                     (party === 'B' && caseData.verdict.winner === 'Party B')
            }

            return (
              <motion.div
                key={caseData.id}
                className="bg-white/5 border border-white/10 p-4 cursor-pointer hover:border-judge-gold/50 transition-colors group"
                onClick={() => viewCase(caseData)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Winner Badge */}
                    {caseData.verdict.winner !== 'Draw' && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold px-2 py-1 tracking-widest uppercase">
                          WINNER
                        </span>
                      </div>
                    )}

                    {/* Parties */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`font-bold ${
                        isWinner('A') ? 'text-[#22c55e]' :
                        caseData.verdict.winner === 'Draw' ? 'text-white' : 'text-[#dc2626]'
                      }`}>
                        {caseData.partyAName}
                      </span>
                      <span className="text-white/40 text-sm">vs</span>
                      <span className={`font-bold ${
                        isWinner('B') ? 'text-[#22c55e]' :
                        caseData.verdict.winner === 'Draw' ? 'text-white' : 'text-[#dc2626]'
                      }`}>
                        {caseData.partyBName}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-white/60 font-bold tracking-widest uppercase mb-2">
                      <span>TOXICITY: {caseData.verdict.toxicity}%</span>
                      <span>{caseData.evidence.type === 'screenshots' ? 'SCREENSHOTS' : 'TEXT'}</span>
                    </div>

                    {/* Date */}
                    <div className="text-white/40 text-xs">
                      {formatDate(caseData.timestamp)}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(caseData.id, e)}
                    className="text-white/30 hover:text-[#dc2626] p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete case"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
