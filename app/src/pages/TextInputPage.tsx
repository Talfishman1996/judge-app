
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'

interface Person {
  id: string
  name: string
}

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
  </svg>
)

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default function TextInputPage() {
  const navigate = useNavigate()
  const [conversation, setConversation] = useState('')
  const [context, setContext] = useState('')
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: '' },
    { id: '2', name: '' }
  ])

  const canAddMore = people.length < 6

  const addPerson = () => {
    if (!canAddMore) return
    const newId = String(Date.now())
    setPeople([...people, { id: newId, name: '' }])
  }

  const removePerson = (id: string) => {
    if (people.length <= 2) return
    setPeople(people.filter(p => p.id !== id))
  }

  const updatePersonName = (id: string, name: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, name } : p))
  }

  const namedPeople = people.filter(p => p.name.trim())
  const isValid = conversation.trim().length >= 50 && namedPeople.length >= 2

  const handleSubmit = () => {
    if (!isValid) return

    const names = people.filter(p => p.name.trim()).map(p => p.name.trim())

    const payload = {
      type: 'text',
      conversation,
      partyA: names[0] || '',
      partyB: names[1] || '',
      parties: names,
      context
    }

    sessionStorage.setItem('evidence', JSON.stringify(payload))
    localStorage.setItem('evidence', JSON.stringify(payload))

    navigate('/deliberation')
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <div className="max-w-md mx-auto space-y-5">

        <motion.div
          className="flex items-center justify-between py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors"
          >
            <BackIcon />
          </button>
          <h1 className="text-white text-lg font-bold tracking-widest">ENTER TESTIMONY</h1>
          <div className="w-6" />
        </motion.div>

        <motion.p
          className="text-white/40 text-xs font-bold tracking-widest text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          PASTE THE CONVERSATION FOR JUDGMENT
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white/60 text-xs font-bold tracking-widest">PARTIES INVOLVED</h2>
            <span className="text-white/30 text-xs font-mono">{people.length}/6</span>
          </div>

          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <AnimatePresence mode="popLayout">
              {people.map((person, idx) => (
                <motion.div
                  key={person.id}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  layout
                >
                  <span className="text-white/40 text-xs font-mono w-8 shrink-0">
                    P{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    placeholder={`Person ${idx + 1} name...`}
                    className="flex-1 bg-black/50 border border-white/20 rounded-lg text-white px-3 py-2.5 text-sm font-medium focus:border-yellow-500/60 focus:outline-none transition-colors placeholder:text-white/30"
                  />
                  {people.length > 2 && (
                    <motion.button
                      onClick={() => removePerson(person.id)}
                      className="text-white/30 hover:text-red-500 transition-colors p-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TrashIcon />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {canAddMore && (
              <motion.button
                onClick={addPerson}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/20 text-white/40 hover:text-white/60 hover:border-white/40 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <PlusIcon />
                <span className="text-xs font-bold tracking-wider">ADD PERSON</span>
              </motion.button>
            )}

            <div className="text-center">
              <span className={`text-[10px] font-mono ${namedPeople.length >= 2 ? 'text-emerald-500' : 'text-white/30'}`}>
                {namedPeople.length >= 2 ? 'MINIMUM 2 PARTIES MET' : `${2 - namedPeople.length} MORE NAME${2 - namedPeople.length !== 1 ? 'S' : ''} NEEDED`}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white/60 text-xs font-bold tracking-widest mb-3">THE CONVERSATION</h2>

          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder="Paste the conversation here. Include who said what for best results..."
              className="w-full h-48 bg-transparent text-white text-sm font-medium focus:outline-none resize-none placeholder:text-white/30"
            />
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className={`text-[10px] font-mono ${conversation.length < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                {conversation.length < 50 ? `${50 - conversation.length} MORE CHARS NEEDED` : 'MINIMUM MET'}
              </span>
              <span className="text-white/30 text-[10px] font-mono">{conversation.length} CHARS</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-white/60 text-xs font-bold tracking-widest mb-3">CONTEXT (OPTIONAL)</h2>

          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What is this dispute about? E.g., 'This is about who forgot to take out the trash' or 'Argument about vacation planning'"
              className="w-full h-24 bg-transparent text-white text-sm font-medium focus:outline-none resize-none placeholder:text-white/30"
            />
          </div>
          <p className="text-white/30 text-[10px] font-mono mt-2 text-center">
            CONTEXT HELPS THE COURT UNDERSTAND THE SITUATION
          </p>
        </motion.div>

        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold tracking-wider text-sm transition-all ${
              isValid
                ? 'text-black'
                : 'text-white/40 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: isValid ? '#facc15' : 'rgba(255, 255, 255, 0.1)',
              border: isValid ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            PROCEED TO JUDGMENT
          </motion.button>
        </motion.div>

        {!isValid && (
          <motion.div
            className="text-center space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {namedPeople.length < 2 && (
              <p className="text-red-500/60 text-[10px] font-mono">NAME AT LEAST 2 PARTIES</p>
            )}
            {conversation.length < 50 && (
              <p className="text-red-500/60 text-[10px] font-mono">CONVERSATION TOO SHORT</p>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}
