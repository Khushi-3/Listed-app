import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import JobBoard from './pages/JobBoard'
import Tracker from './pages/Tracker'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </main>
    </div>
  )
}