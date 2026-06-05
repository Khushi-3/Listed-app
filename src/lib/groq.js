export async function summarizeJob(jobDescription) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Summarize this job description in exactly 5 short bullet points. Focus on: role, key responsibilities, required skills, experience needed, and one standout detail.

Job Description:
${jobDescription}`
        }
      ],
      max_tokens: 300
    })
  })
  const data = await response.json()
  return data.choices[0].message.content
}

export async function analyzeSkillsGap(jobDescription, userSkills) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Compare these job requirements with the candidate's skills and give a match score out of 100, list matching skills, and list missing skills.

Job Description:
${jobDescription}

Candidate Skills:
${userSkills}

Respond in this exact format:
Score: [number]/100
Matching skills: [comma separated list]
Missing skills: [comma separated list]
Tip: [one sentence advice]`
        }
      ],
      max_tokens: 300
    })
  })
  const data = await response.json()
  return data.choices[0].message.content
}