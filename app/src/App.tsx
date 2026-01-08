import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-judge-black flex flex-col items-center justify-center p-8">
      {/* ALL RISE Header */}
      <div className="text-center mb-12">
        <h1 className="text-judge-gold text-6xl font-bold tracking-ultrawide mb-4 text-shadow-glow">
          ALL RISE
        </h1>
        <p className="text-judge-white/60 text-lg tracking-wider">
          THE COURT IS NOW IN SESSION
        </p>
      </div>

      {/* Main Header */}
      <h2 className="text-judge-white text-3xl font-bold tracking-widest mb-12 text-center">
        PRESENT YOUR CASE
      </h2>

      {/* Evidence Type Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button className="flex-1 bg-transparent border-2 border-judge-gold text-judge-gold py-4 px-8 text-lg font-bold tracking-wider hover:bg-judge-gold hover:text-judge-black transition-all duration-300">
          UPLOAD SCREENSHOTS
        </button>
        <button className="flex-1 bg-transparent border-2 border-judge-purple text-judge-purple py-4 px-8 text-lg font-bold tracking-wider hover:bg-judge-purple hover:text-judge-black transition-all duration-300">
          PASTE TEXT
        </button>
      </div>

      {/* Footer */}
      <p className="text-judge-white/40 text-sm mt-16 tracking-wide">
        Justice will be served
      </p>
    </div>
  )
}

export default App
