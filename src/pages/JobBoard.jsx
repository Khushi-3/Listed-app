import { useEffect, useState, useRef } from 'react'
import { Search } from 'lucide-react'
import { searchJobs } from '../lib/jsearch'
import JobCard from '../components/JobCard'

const PROFILE_KEY = 'listedAppProfile'

function extractQueryFromResume(resume) {
  const lines = resume
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (!lines.length) return ''

  const keywordLine = lines.find(line => /developer|engineer|designer|manager|analyst|consultant|product|marketing|sales|data/i.test(line))
  return keywordLine || lines[0]
}

function extractEmailFromText(text) {
  // Find all email-like patterns
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  const matches = String(text).match(emailRegex) || []
  
  if (!matches.length) return ''
  
  // Filter out obvious placeholders only (example.com, test.com, localhost, etc.)
  const obviousPlaceholders = [
    'example.com',
    'test.com',
    'sample.com',
    'demo.com',
    'placeholder.com',
    'localhost',
  ]
  
  // Find the first email that isn't an obvious placeholder
  const validEmail = matches.find(email => {
    const domain = email.split('@')[1].toLowerCase()
    const isPlaceholder = obviousPlaceholders.some(pd => domain === pd || domain.endsWith('.' + pd))
    const hasValidDomain = domain.includes('.') && !domain.endsWith('.')
    const isNotSuspicious = !email.includes('..') && email.length > 5
    return !isPlaceholder && hasValidDomain && isNotSuspicious
  })
  
  return validEmail || ''
}

export default function JobBoard() {
  const [mode, setMode] = useState('resume')
  const [location, setLocation] = useState('India')
  const [searchQuery, setSearchQuery] = useState('')
  const [manualExp, setManualExp] = useState('any')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState({ email: '', resume: '' })
  const [isReturning, setIsReturning] = useState(false)
  const [updateResume, setUpdateResume] = useState(false)
  const [resumeDraft, setResumeDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedName, setUploadedName] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProfile(parsed)
        setEmailDraft(parsed.email || '')
        setResumeDraft(parsed.resume || '')
        setIsReturning(true)
      } catch {
        localStorage.removeItem(PROFILE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (mode === 'resume' && profile.resume && !updateResume) {
      const inferred = extractQueryFromResume(profile.resume)
      setSearchQuery(inferred)
    }
  }, [mode, profile.resume, updateResume])

  useEffect(() => {
    if (mode === 'resume' && resumeDraft && !emailDraft) {
      const extracted = extractEmailFromText(resumeDraft)
      if (extracted) {
        setEmailDraft(extracted)
      }
    }
  }, [resumeDraft, mode])

  async function handleSearch(e) {
    e?.preventDefault()
    setError('')

    if (mode === 'resume') {
      if (!profile.email || !profile.resume) {
        setError('Please save your profile with email and resume first.')
        return
      }
      if (updateResume && !resumeDraft.trim()) {
        setError('Please enter your updated resume to continue.')
        return
      }
    }

    const query = mode === 'resume'
      ? extractQueryFromResume(updateResume ? resumeDraft : profile.resume)
      : searchQuery

    if (!query.trim()) {
      setError('Please enter a role or upload your resume to search.')
      return
    }

    setLoading(true)
    setSearched(true)
    setJobs([])

    try {
      const results = await searchJobs(query, location)
      let list = Array.isArray(results) ? results : []

      if (mode === 'manual' && manualExp && manualExp !== 'any') {
        const ranges = {
          '0-2': [0, 2],
          '3-5': [3, 5],
          '6-9': [6, 9],
          '10+': [10, 100]
        }
        const [min, max] = ranges[manualExp] || [0, 100]
        list = list.filter(job => {
          const yrs = job.required_experience_years ?? job.required_experience_year ?? null
          if (typeof yrs === 'number') return yrs >= min && yrs <= max
          const senior = (job.seniority_level || '').toLowerCase()
          if (min <= 2 && /junior|entry|intern/i.test(senior)) return true
          if (min >= 3 && min <= 5 && /mid|associate|intermediate/i.test(senior)) return true
          if (min >= 6 && /senior|lead|principal|staff/i.test(senior)) return true
          return false
        })
      }

      setJobs(list)
    } catch (err) {
      console.error('Job search failed', err)
      setJobs([])
      setError(err?.message || 'Job search failed. Check your API key and network connection.')
    } finally {
      setLoading(false)
    }
  }

  function saveProfile() {
    const candidate = {
      email: emailDraft.trim(),
      resume: resumeDraft.trim()
    }
    if (!candidate.resume) {
      setError('Resume is required to save your profile.')
      return
    }

    // if email not provided, try extracting from resume
    if (!candidate.email) {
      const extracted = extractEmailFromText(candidate.resume)
      if (extracted) {
        candidate.email = extracted
        setEmailDraft(extracted)
      }
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(candidate))
    setProfile(candidate)
    setIsReturning(true)
    setUpdateResume(false)
    setError('')
  }

  async function handleFileInput(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    
    // Validate file type
    const name = (file.name || '').toLowerCase()
    const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf')
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.docx')
    
    if (!isPdf && !isDocx) {
      setError('Only PDF and DOCX files are supported. Please upload a PDF or DOCX file.')
      setUploadedName('')
      return
    }
    
    setError('')
    setUploading(true)
    setUploadedName(file.name)
    try {
      const buf = await file.arrayBuffer()
      let text = ''
      
      if (isDocx) {
        // Parse DOCX using JSZip to extract text from document.xml
        const JSZip = await import('jszip')
        const zip = new JSZip.default()
        await zip.loadAsync(buf)
        const docXmlFile = zip.file('word/document.xml')
        if (docXmlFile) {
          const docXml = await docXmlFile.async('text')
          if (docXml) {
            // Extract text content from XML by removing tags and decoding entities
            text = docXml
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .trim()
          }
        }
      } else {
        // For PDF, attempt basic UTF-8 text extraction
        const decoder = new TextDecoder('utf-8')
        text = decoder.decode(buf).trim()
      }

      if (!text) {
        setError('No text could be extracted. Please ensure the file contains readable text.')
        return
      }

      setResumeDraft(text)
    } catch (err) {
      console.error('File parse error', err)
      const msg = err && err.message ? `${err.name}: ${err.message}` : String(err)
      setError(`File parse error: ${msg}`)
    } finally {
      setUploading(false)
    }
  }

  function clearProfile() {
    localStorage.removeItem(PROFILE_KEY)
    setProfile({ email: '', resume: '' })
    setEmailDraft('')
    setResumeDraft('')
    setIsReturning(false)
    setUpdateResume(false)
    setError('')
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job Board</h1>
          <p className="text-gray-500 mt-1">Search jobs matched to your resume or manually enter role and location.</p>
        </div>
        <div className="flex rounded-full border border-gray-200 overflow-hidden text-sm">
          {['resume', 'manual'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setMode(tab)}
              className={`px-5 py-2 ${mode === tab ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {tab === 'resume' ? 'Search with resume' : 'Search manually'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'resume' ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Resume-based search</h2>
                <p className="text-sm text-gray-500">Enter your email and paste your resume. We’ll use it to infer your best matches.</p>
              </div>
              {profile.email && (
                <div className="text-sm text-gray-600">
                  Returning user: <span className="font-medium">{profile.email}</span>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-700">
                Email address
                <input
                  value={emailDraft}
                  onChange={e => setEmailDraft(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-700">
                Location filter
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="India"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                />
              </label>
            </div>

            <label className="block text-sm text-gray-700">
              Resume text
              <textarea
                value={resumeDraft}
                onChange={e => setResumeDraft(e.target.value)}
                rows={8}
                placeholder="Paste your resume or CV here"
                className="mt-2 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
              />
            </label>

            <div className="block text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Upload a file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileInput}
                  aria-label="Upload resume file"
                  className="sr-only"
                />
                <div className="text-sm text-gray-500">
                  {uploading ? `Reading ${uploadedName || 'file'}…` : (uploadedName ? `Loaded: ${uploadedName}` : 'PDF, DOCX, or text file')}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveProfile}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Save profile
              </button>
              {isReturning && (
                <button
                  type="button"
                  onClick={() => setUpdateResume(prev => !prev)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {updateResume ? 'Use saved resume' : 'Update resume'}
                </button>
              )}
              {isReturning && (
                <button
                  type="button"
                  onClick={clearProfile}
                  className="rounded-xl border border-red-200 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  Reset profile
                </button>
              )}
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
              Resume mode uses your saved profile to infer the best matching role. For return customers, confirm whether your resume changed before searching.
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manual search</h2>
              <p className="text-sm text-gray-500">Enter the role and location you want to search for.</p>
            </div>
            <div className="text-sm text-gray-600">No resume required.</div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-gray-700">
              Role or keyword
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Product manager, frontend, marketing"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Location
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="India"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              Experience
              <select
                name="experience"
                value={manualExp}
                onChange={e => setManualExp(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm bg-white"
              >
                <option value="any">Any</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-9">6-9 years</option>
                <option value="10+">10+ years</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Search manually
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="grid gap-4 mb-8">
        {mode === 'resume' ? (
          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 md:w-auto"
          >
            Search with resume
          </button>
        ) : null}
      </form>

      {loading && (
        <div className="text-center py-12 text-gray-400">Searching jobs...</div>
      )}

      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {!loading && !error && searched && jobs.length === 0 && (
        <div className="text-center py-12 text-gray-400">No jobs found. Try a different search.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
    </div>
  )
}
