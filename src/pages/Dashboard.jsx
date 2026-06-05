import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Welcome to Listed</h1>
        <p className="text-gray-600 max-w-2xl">
          Search jobs, track applications, and view your dashboard in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/jobs"
          className="rounded-3xl bg-emerald-600 px-6 py-8 text-white shadow-sm hover:bg-emerald-700"
        >
          <h2 className="text-xl font-semibold">Browse Jobs</h2>
          <p className="mt-2 text-sm text-emerald-100">Search live listings across multiple platforms.</p>
        </Link>
        <Link
          to="/tracker"
          className="rounded-3xl bg-slate-800 px-6 py-8 text-white shadow-sm hover:bg-slate-900"
        >
          <h2 className="text-xl font-semibold">Application Tracker</h2>
          <p className="mt-2 text-sm text-slate-200">Keep track of your job applications and next steps.</p>
        </Link>
      </div>
    </div>
  )
}
