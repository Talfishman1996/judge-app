import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import TextInputPage from './pages/TextInputPage'
import DeliberationPage from './pages/DeliberationPage'
import VerdictPage from './pages/VerdictPage'
import SharePage from './pages/SharePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/text" element={<TextInputPage />} />
        <Route path="/deliberation" element={<DeliberationPage />} />
        <Route path="/verdict" element={<VerdictPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
