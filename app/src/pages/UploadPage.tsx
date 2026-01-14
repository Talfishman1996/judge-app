import { useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { saveTempEvidence } from '../services/database'

interface Exhibit {
  id: string
  file: File
  preview: string
  label: string
}

const EXHIBIT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export default function UploadPage() {
  const navigate = useNavigate()
  const [exhibits, setExhibits] = useState<Exhibit[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [timestamp, setTimestamp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [party1Name, setParty1Name] = useState('')
  const [party2Name, setParty2Name] = useState('')

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

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newExhibits: Exhibit[] = []
    const currentCount = exhibits.length

    Array.from(files).forEach((file, index) => {
      if (currentCount + index >= 10) return
      if (!file.type.startsWith('image/')) return

      const exhibit: Exhibit = {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        label: EXHIBIT_LABELS[currentCount + index]
      }
      newExhibits.push(exhibit)
    })

    setExhibits(prev => [...prev, ...newExhibits])
  }, [exhibits.length])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeExhibit = useCallback((id: string) => {
    setExhibits(prev => {
      const filtered = prev.filter(e => e.id !== id)
      return filtered.map((exhibit, index) => ({
        ...exhibit,
        label: EXHIBIT_LABELS[index]
      }))
    })
  }, [])

  const handleSubmit = async () => {
    if (exhibits.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const exhibitData = await Promise.all(
        exhibits.map(async (exhibit) => {
          const base64 = await fileToBase64(exhibit.file)
          return {
            label: exhibit.label,
            data: base64,
            type: exhibit.file.type
          }
        })
      )

      const evidencePayload = {
        type: 'screenshots',
        exhibits: exhibitData,
        partyNames: {
          party1: party1Name.trim() || 'Party 1',
          party2: party2Name.trim() || 'Party 2'
        }
      }

      await saveTempEvidence(evidencePayload as any)

      navigate('/deliberation')
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to process images')
      setIsSubmitting(false)
    }
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
        <div>EVIDENCE INTAKE</div>
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
            className="px-6 py-2 border-2 border-red-600"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <span className="text-sm font-black tracking-[0.2em] text-red-500 font-mono">
              SUBMIT EVIDENCE
            </span>
          </div>
        </motion.div>

        <p className="text-white/40 text-xs font-mono tracking-wider">
          UPLOAD UP TO 10 SCREENSHOTS AS EXHIBITS
        </p>
      </div>

      {/* Party Names Section */}
      <div className="px-4 pb-4">
        <div className="border border-white/10 bg-white/5 p-4 rounded">
          <p className="text-white/60 text-xs font-mono tracking-wider mb-3 text-center">
            IDENTIFY THE PARTIES (OPTIONAL)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/40 text-[10px] font-mono tracking-wider mb-1">
                PARTY 1
              </label>
              <input
                type="text"
                value={party1Name}
                onChange={(e) => setParty1Name(e.target.value)}
                placeholder="e.g., John, Defendant..."
                className="w-full bg-black border border-white/20 text-white px-3 py-2 text-sm font-mono placeholder:text-white/20 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/40 text-[10px] font-mono tracking-wider mb-1">
                PARTY 2
              </label>
              <input
                type="text"
                value={party2Name}
                onChange={(e) => setParty2Name(e.target.value)}
                placeholder="e.g., Jane, Plaintiff..."
                className="w-full bg-black border border-white/20 text-white px-3 py-2 text-sm font-mono placeholder:text-white/20 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div className="flex-1 px-4 pb-4">
        <motion.div
          className={`h-full border-2 border-dashed rounded transition-colors duration-300 ${
            isDragging
              ? 'border-red-500 bg-red-500/10'
              : 'border-white/20 hover:border-white/40'
          } ${exhibits.length >= 10 ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {exhibits.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="text-red-500 text-6xl mb-4 font-mono">+</div>
              <p className="text-white font-mono font-bold tracking-wider mb-2">
                DROP SCREENSHOTS HERE
              </p>
              <p className="text-white/40 text-xs font-mono mb-4">
                or tap to select files
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="file-input"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer border-2 border-red-500 text-red-500 px-6 py-3 text-sm font-mono font-bold tracking-wider hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                SELECT FILES
              </label>
            </div>
          ) : (
            <div className="p-3 h-full overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {exhibits.map((exhibit, index) => (
                  <motion.div
                    key={exhibit.id}
                    className="relative aspect-square bg-white/5 overflow-hidden group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {/* Evidence frame corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/60 z-10" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/60 z-10" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/60 z-10" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/60 z-10" />

                    <img
                      src={exhibit.preview}
                      alt={`Exhibit ${exhibit.label}`}
                      className="w-full h-full object-cover"
                      style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                    />
                    <div className="absolute top-1 left-1 bg-red-600 text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                      EX-{exhibit.label}
                    </div>
                    <button
                      onClick={() => removeExhibit(exhibit.id)}
                      className="absolute top-1 right-1 bg-black/80 text-red-500 w-6 h-6 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity font-mono"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}

                {/* Add more button */}
                {exhibits.length < 10 && (
                  <motion.label
                    htmlFor="file-input-add"
                    className="aspect-square border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="file-input-add"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    <span className="text-white/40 text-3xl font-mono">+</span>
                  </motion.label>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Error message */}
      {submitError && (
        <div className="px-4 pb-2">
          <div className="bg-red-900/30 border border-red-500/50 px-4 py-2 text-red-400 text-xs font-mono">
            ERROR: {submitError}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button
          onClick={handleSubmit}
          disabled={exhibits.length === 0 || isSubmitting}
          className={`w-full py-4 font-black text-sm tracking-wider uppercase font-mono transition-all duration-200 ${
            exhibits.length > 0 && !isSubmitting
              ? 'hover:scale-[1.02] active:scale-[0.98]'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: exhibits.length > 0 && !isSubmitting
              ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
              : 'rgba(255,255,255,0.1)',
            border: exhibits.length > 0 && !isSubmitting
              ? '2px solid #dc2626'
              : '2px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-pulse">●</span> PROCESSING...
            </span>
          ) : (
            `PROCEED TO JUDGMENT (${exhibits.length}/10)`
          )}
        </button>
      </div>
    </div>
  )
}

async function fileToBase64(file: File): Promise<string> {
  // Compress image to reduce storage usage (iOS has strict quotas)
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Max dimension 1200px to keep file size reasonable
      const MAX_SIZE = 1200
      let { width, height } = img

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = (height / width) * MAX_SIZE
          width = MAX_SIZE
        } else {
          width = (width / height) * MAX_SIZE
          height = MAX_SIZE
        }
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      // Use JPEG at 70% quality for much smaller files
      const compressed = canvas.toDataURL('image/jpeg', 0.7)
      resolve(compressed)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
