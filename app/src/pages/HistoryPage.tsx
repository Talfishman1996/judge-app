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
          CASE HISTORY
        </h1>
        <p className="text-judge-white/60 text-sm mt-2">
          {cases.length} case{cases.length !== 1 ? 's' : ''} on record
        </p>
      </motion.div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-judge-white/40">Loading cases...</div>
        </div>
      ) : cases.length === 0 ? (
        /* Empty State */
        <motion.div
          className="flex-1 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-judge-white/20 text-6xl mb-4">
            <svg viewBox="0 0 24 24" className="w-24 h-24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
          </div>
          <p className="text-judge-white/40 text-lg tracking-wider mb-2">NO CASES ON RECORD</p>
          <p className="text-judge-white/30 text-sm">Your verdict history will appear here</p>

          <button
            onClick={() => navigate('/')}
            className="mt-8 border border-judge-gold text-judge-gold px-6 py-3 font-bold tracking-wider hover:bg-judge-gold hover:text-judge-black transition-all"
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
          {cases.map((caseData, index) => (
            <motion.div
              key={caseData.id}
              className="bg-judge-white/5 border border-judge-white/10 p-4 cursor-pointer hover:border-judge-gold/50 transition-colors group"
              onClick={() => viewCase(caseData)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Winner */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-bold px-2 py-0.5 ${
                      caseData.verdict.winner === 'Draw'
                        ? 'bg-judge-white/20 text-judge-white'
                        : 'bg-judge-gold/20 text-judge-gold'
                    }`}>
                      {caseData.verdict.winner === 'Party A' ? caseData.partyAName :
                       caseData.verdict.winner === 'Party B' ? caseData.partyBName :
                       'DRAW'}
                    </span>
                    {caseData.verdict.winner !== 'Draw' && (
                      <span className="text-judge-white/60 text-sm">prevails</span>
                    )}
                  </div>

                  {/* Parties */}
                  <div className="text-judge-white/80 text-sm mb-2">
                    <span className="text-judge-gold">{caseData.partyAName}</span>
                    <span className="text-judge-white/40 mx-2">vs</span>
                    <span className="text-judge-purple">{caseData.partyBName}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-judge-white/40">
                    <span>Toxicity: {caseData.verdict.toxicity}%</span>
                    <span>{caseData.evidence.type === 'screenshots' ? 'Screenshots' : 'Text'}</span>
                  </div>

                  {/* Date */}
                  <div className="text-judge-white/30 text-xs mt-2">
                    {formatDate(caseData.timestamp)}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(caseData.id, e)}
                  className="text-judge-white/30 hover:text-judge-red p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete case"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
