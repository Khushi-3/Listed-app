import axios from 'axios'

const BASE_URL = 'https://api.openwebninja.com/jsearch/search-v2'
const apiKey = import.meta.env.VITE_JSEARCH_API_KEY

if (!apiKey) {
  throw new Error('Missing VITE_JSEARCH_API_KEY environment variable. Add your OpenWeb Ninja JSearch key to .env.')
}

export async function searchJobs(query, location = 'India', page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        query: `${query} in ${location}`,
        page: String(page),
        num_pages: '1',
        date_posted: 'month'
      },
      headers: {
        'x-api-key': apiKey
      }
    })
    return response.data.data?.jobs || []
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status
      const apiMessage = error.response.data?.message || error.response.statusText
      if (status === 401 || status === 403) {
        throw new Error(`JSearch authorization failed (${status}). Check VITE_JSEARCH_API_KEY in .env and your OpenWeb Ninja subscription.`)
      }
      throw new Error(`JSearch request failed (${status}): ${apiMessage}`)
    }
    throw new Error(`JSearch request failed: ${error.message || 'Unknown error'}`)
  }
}
