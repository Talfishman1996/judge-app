import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

interface Verdict {
  winner: string
  winner_reason: string
  credibility: {
    partyA: number
    partyB: number
  }
  toxicity: number
  manipulation_tactics: Array<{
    name: string
    evidence: string
    severity: string
  }>
  red_flags: Array<{
    flag: string
    party: string
    evidence: string
  }>
  evidence_log: Array<{
    exhibit: string
    summary: string
    favors: string
  }>
  judges_opinion: string
  recommendations: {
    partyA: string
    partyB: string
  }
}

export default function VerdictPage() {
  const navigate = useNavigate()
  const [verdict, setVerdict] = useState<Verdict | null>(null)

  useEffect(() => {
    const verdictData = sessionStorage.getItem('verdict')
    if (!verdictData) {
      navigate('/')
      return
    }
    setVerdict(JSON.parse(verdictData))
  }, [navigate])

  if (!verdict) return null

  const evidence = JSON.parse(sessionStorage.getItem('evidence') || '{}')
  const partyAName = evidence.partyA || 'Party A'
  const partyBName = evidence.partyB || 'Party B'

  return (
    <div className="min-h-screen bg-judge-black p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Winner Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-judge-gold text-sm tracking-widest mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            THE COURT HAS REACHED A VERDICT
          </motion.div>
          <motion.h1
            className="text-judge-gold text-4xl sm:text-6xl font-bold tracking-wider mb-4 text-shadow-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {verdict.winner === 'Party A' ? partyAName.toUpperCase() :
             verdict.winner === 'Party B' ? partyBName.toUpperCase() :
             'DRAW'}
          </motion.h1>
          <motion.p
            className="text-judge-white text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {verdict.winner === 'Draw' ? 'Both parties share responsibility' : 'PREVAILS'}
          </motion.p>
        </motion.div>

        {/* Winner Reason */}
        <motion.div
          className="bg-judge-white/5 border border-judge-gold/30 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-judge-white/80 italic">"{verdict.winner_reason}"</p>
        </motion.div>

        {/* Credibility Scores */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-judge-white/5 p-4">
            <div className="text-judge-gold text-sm font-bold tracking-wider mb-2">{partyAName}</div>
            <div className="text-3xl font-bold text-judge-white mb-2">{verdict.credibility.partyA}%</div>
            <div className="h-2 bg-judge-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-judge-gold"
                initial={{ width: 0 }}
                animate={{ width: `${verdict.credibility.partyA}%` }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </div>
            <div className="text-judge-white/60 text-xs mt-1">CREDIBILITY</div>
          </div>
          <div className="bg-judge-white/5 p-4">
            <div className="text-judge-purple text-sm font-bold tracking-wider mb-2">{partyBName}</div>
            <div className="text-3xl font-bold text-judge-white mb-2">{verdict.credibility.partyB}%</div>
            <div className="h-2 bg-judge-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-judge-purple"
                initial={{ width: 0 }}
                animate={{ width: `${verdict.credibility.partyB}%` }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </div>
            <div className="text-judge-white/60 text-xs mt-1">CREDIBILITY</div>
          </div>
        </motion.div>

        {/* Toxicity Meter */}
        <motion.div
          className="bg-judge-white/5 p-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="text-judge-red text-sm font-bold tracking-wider mb-2">TOXICITY LEVEL</div>
          <div className="text-4xl font-bold text-judge-red mb-2">{verdict.toxicity}%</div>
          <div className="h-3 bg-judge-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                background: `linear-gradient(90deg, #D4A843 0%, #FF3B3B ${verdict.toxicity}%)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${verdict.toxicity}%` }}
              transition={{ delay: 1.5, duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Manipulation Tactics */}
        {verdict.manipulation_tactics.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <h2 className="text-judge-red text-lg font-bold tracking-wider mb-4">MANIPULATION TACTICS DETECTED</h2>
            <div className="space-y-3">
              {verdict.manipulation_tactics.map((tactic, index) => (
                <div key={index} className="bg-judge-red/10 border border-judge-red/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-judge-red font-bold">{tactic.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      tactic.severity === 'high' ? 'bg-judge-red text-white' :
                      tactic.severity === 'medium' ? 'bg-yellow-500/80 text-black' :
                      'bg-judge-white/20 text-judge-white'
                    }`}>
                      {tactic.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-judge-white/70 text-sm italic">"{tactic.evidence}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Red Flags */}
        {verdict.red_flags.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <h2 className="text-judge-red text-lg font-bold tracking-wider mb-4">RED FLAGS</h2>
            <div className="flex flex-wrap gap-3">
              {verdict.red_flags.map((flag, index) => (
                <div key={index} className="bg-judge-red/20 border border-judge-red px-4 py-2">
                  <span className="text-judge-red font-bold">{flag.flag}</span>
                  <span className="text-judge-white/60 text-sm ml-2">({flag.party === 'A' ? partyAName : partyBName})</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Evidence Log */}
        {verdict.evidence_log.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <h2 className="text-judge-gold text-lg font-bold tracking-wider mb-4">EVIDENCE LOG</h2>
            <div className="space-y-3">
              {verdict.evidence_log.map((item, index) => (
                <div key={index} className="bg-judge-white/5 p-4 flex items-start gap-4">
                  <div className="bg-judge-gold text-judge-black px-2 py-1 text-sm font-bold shrink-0">
                    EX. {item.exhibit}
                  </div>
                  <div className="flex-1">
                    <p className="text-judge-white/80">{item.summary}</p>
                    <p className="text-judge-gold/80 text-sm mt-1">Favors: {item.favors === 'Party A' ? partyAName : partyBName}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Judge's Opinion */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <h2 className="text-judge-gold text-lg font-bold tracking-wider mb-4">JUDGE'S OPINION</h2>
          <div className="bg-judge-gold/10 border-l-4 border-judge-gold p-6">
            <p className="text-judge-white/90 leading-relaxed">{verdict.judges_opinion}</p>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          <div className="bg-judge-gold/10 border border-judge-gold/30 p-4">
            <div className="text-judge-gold text-sm font-bold tracking-wider mb-2">RECOMMENDATION FOR {partyAName.toUpperCase()}</div>
            <p className="text-judge-white/80 text-sm">{verdict.recommendations.partyA}</p>
          </div>
          <div className="bg-judge-purple/10 border border-judge-purple/30 p-4">
            <div className="text-judge-purple text-sm font-bold tracking-wider mb-2">RECOMMENDATION FOR {partyBName.toUpperCase()}</div>
            <p className="text-judge-white/80 text-sm">{verdict.recommendations.partyB}</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          <button
            onClick={() => navigate('/share')}
            className="bg-judge-gold text-judge-black px-6 py-3 font-bold tracking-wider hover:bg-judge-gold/80 transition-colors"
          >
            SHARE VERDICT
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('evidence')
              sessionStorage.removeItem('verdict')
              navigate('/')
            }}
            className="border border-judge-white/30 text-judge-white px-6 py-3 font-bold tracking-wider hover:bg-judge-white/10 transition-colors"
          >
            NEW CASE
          </button>
          <button
            onClick={() => navigate('/history')}
            className="border border-judge-white/30 text-judge-white px-6 py-3 font-bold tracking-wider hover:bg-judge-white/10 transition-colors"
          >
            CASE HISTORY
          </button>
        </motion.div>
      </div>
    </div>
  )
}
