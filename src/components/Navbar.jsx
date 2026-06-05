import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">
          Listed App
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link to="/">Dashboard</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/tracker">Tracker</Link>
        </nav>
      </div>
    </header>
  )
}
