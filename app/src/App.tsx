import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import TextInputPage from './pages/TextInputPage'
import DeliberationPage from './pages/DeliberationPage'
import VerdictPage from './pages/VerdictPage'
import SharePage from './pages/SharePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import TestPage from './pages/TestPage'
import ComparePage from './pages/ComparePage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/upload" element={<Layout><UploadPage /></Layout>} />
        <Route path="/text" element={<Layout><TextInputPage /></Layout>} />
        <Route path="/deliberation" element={<Layout><DeliberationPage /></Layout>} />
        <Route path="/verdict" element={<VerdictPage />} />
        <Route path="/share" element={<Layout><SharePage /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
