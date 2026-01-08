import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

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

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newExhibits: Exhibit[] = []
    const currentCount = exhibits.length

    Array.from(files).forEach((file, index) => {
      if (currentCount + index >= 10) return // Max 10 exhibits
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
      // Relabel exhibits
      return filtered.map((exhibit, index) => ({
        ...exhibit,
        label: EXHIBIT_LABELS[index]
      }))
    })
  }, [])

  const handleSubmit = async () => {
    if (exhibits.length === 0) return

    // Convert images to base64 for API
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

    // Store in sessionStorage for deliberation page
    sessionStorage.setItem('evidence', JSON.stringify({
      type: 'screenshots',
      exhibits: exhibitData
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
        <h1 className="text-judge-gold text-2xl sm:text-3xl font-bold tracking-widest">
          SUBMIT EVIDENCE
        </h1>
        <p className="text-judge-white/60 text-sm mt-2">
          Upload up to 10 screenshots as exhibits
        </p>
      </motion.div>

      {/* Drop Zone */}
      <motion.div
        className={`flex-1 border-2 border-dashed rounded-lg p-4 sm:p-8 transition-colors duration-300 ${
          isDragging
            ? 'border-judge-gold bg-judge-gold/10'
            : 'border-judge-white/30 hover:border-judge-gold/50'
        } ${exhibits.length >= 10 ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {exhibits.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-judge-gold text-6xl mb-4">+</div>
            <p className="text-judge-white text-lg font-bold tracking-wider mb-2">
              DROP SCREENSHOTS HERE
            </p>
            <p className="text-judge-white/60 text-sm mb-4">
              or click to select files
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
              className="cursor-pointer border border-judge-gold text-judge-gold px-6 py-2 text-sm font-bold tracking-wider hover:bg-judge-gold hover:text-judge-black transition-all duration-300"
            >
              SELECT FILES
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {exhibits.map((exhibit, index) => (
              <motion.div
                key={exhibit.id}
                className="relative aspect-square bg-judge-white/5 rounded overflow-hidden group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <img
                  src={exhibit.preview}
                  alt={`Exhibit ${exhibit.label}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-judge-gold text-judge-black px-2 py-1 text-xs font-bold">
                  EXHIBIT {exhibit.label}
                </div>
                <button
                  onClick={() => removeExhibit(exhibit.id)}
                  className="absolute top-2 right-2 bg-judge-red text-white w-6 h-6 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </motion.div>
            ))}

            {/* Add more button */}
            {exhibits.length < 10 && (
              <motion.label
                htmlFor="file-input-add"
                className="aspect-square border-2 border-dashed border-judge-white/30 rounded flex items-center justify-center cursor-pointer hover:border-judge-gold transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: exhibits.length * 0.05 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="file-input-add"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <span className="text-judge-white/60 text-3xl">+</span>
              </motion.label>
            )}
          </div>
        )}
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
          disabled={exhibits.length === 0}
          className={`px-8 py-4 text-lg font-bold tracking-widest transition-all duration-300 ${
            exhibits.length > 0
              ? 'bg-judge-gold text-judge-black hover:bg-judge-gold/80'
              : 'bg-judge-white/20 text-judge-white/40 cursor-not-allowed'
          }`}
        >
          PROCEED TO JUDGMENT ({exhibits.length}/10)
        </button>
      </motion.div>
    </div>
  )
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
