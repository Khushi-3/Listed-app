import { useState } from 'react'
import { MapPin, DollarSign, Calendar, Sparkles, BookmarkPlus } from 'lucide-react'
import { summarizeJob } from '../lib/groq'
import { supabase } from '../lib/supabase'

export default function JobCard({ job }) {
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const sourceName = job.job_publisher || (() => {
        try {
            const url = new URL(job.employer_website || job.job_apply_link)
            return url.hostname.replace(/^www\./, '')
        } catch {
            return ''
        }
    })()

    async function handleSummarize() {
        setLoading(true)
        const result = await summarizeJob(job.job_description || job.job_title)
        setSummary(result)
        setLoading(false)
    }

    async function handleSave() {
        await supabase.from('saved_jobs').insert({
            job_id: job.job_id,
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city || job.job_country,
            salary: job.job_min_salary ? `${job.job_min_salary} - ${job.job_max_salary}` : 'Not specified',
            description: job.job_description,
            source_url: job.job_apply_link
        })
        setSaved(true)
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                    <p className="text-emerald-600 font-medium text-sm mt-0.5">{job.employer_name}</p>
                    {sourceName && (
                      <p className="text-xs text-gray-500 mt-1">Source: {sourceName}</p>
                    )}
                </div>
                {job.employer_logo && (
                    <img src={job.employer_logo} alt={job.employer_name} className="w-10 h-10 rounded-lg object-contain border border-gray-100" />
                )}
            </div>

            <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                {job.job_city && (
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {job.job_city}, {job.job_country}
                    </span>
                )}
                {job.job_min_salary && (
                    <span className="flex items-center gap-1">
                        <DollarSign size={12} /> {job.job_min_salary} - {job.job_max_salary}
                    </span>
                )}
                {job.job_posted_at_datetime_utc && (
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                    </span>
                )}
            </div>

            {summary && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                    {summary}
                </div>
            )}

            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleSummarize}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <Sparkles size={12} />
                    {loading ? 'Summarizing...' : 'AI Summary'}
                </button>
                <button
                    onClick={handleSave}
                    disabled={saved}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <BookmarkPlus size={12} />
                    {saved ? 'Saved!' : 'Save'}
                </button>

                <a
                href={job.job_apply_link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors ml-auto"
        >
                Apply →
            </a>
        </div>
    </div >
  )
}