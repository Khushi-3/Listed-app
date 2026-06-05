# Listed — Your Personal Career Command Center

A personalized AI-powered job search platform that matches real jobs to your resume and tracks your entire job search journey in one place.

![Listed App](https://img.shields.io/badge/Status-MVP-green) ![React](https://img.shields.io/badge/React-18-blue) ![Supabase](https://img.shields.io/badge/Supabase-Ready-blue)

---

## 🎯 The Problem

Job seekers today are overwhelmed. Finding a job requires juggling **3–5 different platforms** — Naukri for listings, LinkedIn for networking, spreadsheets for tracking applications, and YouTube for interview prep. There's no single place that:

- Shows jobs actually relevant to **your experience level**
- Tells you **how well you fit** each role
- Tracks **every application** in one place
- Gives **actionable feedback** on why you might get rejected

**Result:** Job seekers waste hours, apply blindly, and get little feedback.

---

## ✨ The Solution

**Listed** is a one-stop platform that:

1. **Lets you choose how to search:**
   - 🤖 **Smart Search** — Upload your resume, AI finds jobs that match your experience
   - 🔍 **Manual Search** — Enter role, experience, location, job type manually

2. **Shows relevant jobs instantly:**
   - Real-time listings from LinkedIn, Indeed, Glassdoor, ZipRecruiter
   - Jobs ranked by match to your profile
   - Company logos, salary, location, posting date

3. **AI-powered features:**
   - 📄 Resume parsing — extract skills, experience, job titles automatically
   - 🎯 Smart job matching — AI understands what roles fit you
   - 💡 AI summaries — get 5-bullet summary of any job in seconds
   - 🔍 Skills gap analysis — see what skills you're missing for any role

4. **Tracks your entire job search:**
   - Log applications with status (Saved → Applied → Interview → Offer)
   - Notes and follow-up dates for each job
   - Dashboard showing total applied, response rate, interviews scheduled

5. **For return users — zero friction:**
   - Sign in → "Is your resume still current?" 
   - If no → upload new resume
   - If yes → auto-shows matched jobs

---

## 🚀 Features (MVP)

### ✅ Live
- [x] Job Board with real listings (100+ jobs per search)
- [x] Search jobs by title and location
- [x] View job details (salary, location, company, skills)
- [x] AI job summaries (5-bullet breakdown in seconds)
- [x] Save jobs to Tracker
- [x] Apply directly from Listed

### 🔄 In Progress
- [ ] User authentication (Supabase email/password)
- [ ] Resume upload and PDF parsing
- [ ] Smart job matching (resume → AI → auto-search)
- [ ] Manual search mode (keyword-based filters)
- [ ] Application Tracker (status, notes, follow-ups)
- [ ] Dashboard (stats and quick links)
- [ ] Return user flow ("Resume current?" prompt)

### 📅 Post-MVP
- [ ] Skills gap analyzer (what you're missing for a role)
- [ ] Recruiter tips (what hiring managers look for)
- [ ] Salary data and insights
- [ ] Interview prep questions by company
- [ ] Career roadmap (learn → apply → land)
- [ ] Email notifications for new matches
- [ ] Mobile app (React Native)

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast, modern, great DX |
| **Styling** | Tailwind CSS | Utility-first, rapid UI development |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, easy auth |
| **Authentication** | Supabase Auth | Google/email login, built-in |
| **Job Data** | JSearch API (OpenWeb Ninja) | 100M+ listings from LinkedIn, Indeed, Glassdoor |
| **AI Features** | Groq API (Llama 3.3) | Fast, free tier, excellent reasoning |
| **Resume Parsing** | pdf-parse / mammoth | Extract text from PDF/Word resumes |
| **Deployment** | Vercel | Free, fast, great for React |

---

## 📦 Project Structure

```
listed-app/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx       # Home page, quick stats
│   │   ├── JobBoard.jsx        # Search (smart + manual) + results
│   │   ├── Tracker.jsx         # Application tracker (status, notes)
│   │   └── Auth/
│   │       ├── SignUp.jsx      # Email signup
│   │       └── Login.jsx       # Email login
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation
│   │   ├── JobCard.jsx         # Job listing card
│   │   ├── StatusBadge.jsx     # Status pills (Applied, Interview, etc)
│   │   ├── ResumeUpload.jsx    # Resume file input
│   │   └── SearchMode.jsx      # Smart vs Manual toggle
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   ├── jsearch.js          # Job API client
│   │   ├── groq.js             # AI client (Groq)
│   │   └── resumeParser.js     # PDF parsing logic
│   ├── hooks/
│   │   ├── useAuth.js          # Auth context hook
│   │   ├── useJobs.js          # Job search logic
│   │   └── useApplications.js  # Application CRUD
│   ├── App.jsx                 # Main routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # API keys (not in git)
├── .env.example                # Template for .env
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Free accounts:
  - [Supabase](https://supabase.com)
  - [Groq](https://console.groq.com)
  - [OpenWeb Ninja (JSearch)](https://openwebninja.com)

### Installation

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/listed-app.git
cd listed-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Fill in your API keys** in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
VITE_JSEARCH_API_KEY=your_jsearch_api_key
```

5. **Run the dev server**
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📖 How to Use

### First Time User

1. **Sign up** with email and password (or Google login)
2. **Upload your resume** (PDF or Word)
3. Listed parses your resume and auto-shows matching jobs
4. Click **AI Summary** to see job breakdown in 5 bullets
5. Click **Save** to add to your tracker
6. Click **Apply** to go directly to the job posting

### Return User

1. **Sign in** with your email
2. See prompt: "Is your resume still current?"
3. If **Yes** → Jobs auto-load based on your profile
4. If **No** → Upload new resume, then see updated matches

### Manual Search (Optional)

1. Click **Manual Search** tab
2. Enter: Job Title, Experience Level, Location, Job Type
3. See results ranked by relevance
4. Same save/apply/AI summary features

### Track Your Progress

1. Go to **Application Tracker**
2. See all saved and applied jobs
3. Update status: Applied → Screening → Interview → Offer → Rejected
4. Add notes and follow-up dates
5. Dashboard shows: Total Applied, Response Rate, Interviews Scheduled

---

## 🔑 API Keys Setup

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → Data API**
4. Copy **Project URL** and **anon public key**

### Groq
1. Go to [console.groq.com](https://console.groq.com)
2. Click **API Keys** → **Create API Key**
3. Copy the key

### JSearch (OpenWeb Ninja)
1. Go to [openwebninja.com](https://openwebninja.com)
2. Sign up for free tier
3. Go to dashboard, copy your API key

---

## 🎯 Roadmap

### Phase 1 — MVP (Weekend)
- ✅ Job Board with real listings
- 🔄 User auth + resume upload
- 🔄 Smart job matching
- 🔄 Application tracker
- 🔄 Dashboard

### Phase 2 — AI Features (Week 2)
- Skills gap analyzer
- Recruiter tips by company
- Resume optimization feedback
- Interview prep by role

### Phase 3 — Scale (Month 2)
- Mobile app (React Native)
- LinkedIn integration
- Email notifications
- Salary trends by role

### Phase 4 — Premium (Month 3)
- Freemium model
- Advanced analytics
- Career coaching
- Job alerts

---

## 💡 Key Differentiators

| Feature | Listed | Naukri | LinkedIn |
|---|---|---|---|
| AI job matching from resume | ✅ | ❌ | ❌ |
| One-stop application tracker | ✅ | ❌ | ❌ |
| AI job summaries | ✅ | ❌ | ❌ |
| Skills gap analysis | 🔄 | ❌ | ❌ |
| Manual + smart search | ✅ | ✅ | ✅ |
| Resume parsing | 🔄 | ❌ | ✅ |
| India-first job market | ✅ | ✅ | ✅ |

---

## 🤝 Contributing

We're building this product in public. Found a bug? Have a feature idea? Open an issue or submit a PR!

### Development Tips

- **Local testing** — `npm run dev`
- **Build for production** — `npm run build`
- **Deploy to Vercel** — Push to GitHub, auto-deploys
- **Test APIs** — Use Thunder Client in VS Code

---

## 📄 License

MIT — you can use this for personal or commercial projects.

---

## 📧 Contact & Support

- **Email:** listed.careers@gmail.com
- **Twitter:** [@listedcareers](https://twitter.com/listedcareers)
- **Issues:** [GitHub Issues](https://github.com/yourusername/listed-app/issues)

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Job data from [JSearch API](https://jsearch.io)
- AI powered by [Groq](https://groq.com)
- Database by [Supabase](https://supabase.com)
- Designed with [Tailwind CSS](https://tailwindcss.com)

---

## 🎯 Mission

To help every job seeker — fresher or professional — find the right role faster, with confidence, backed by AI that understands their experience level.

**Your career, one clear path.** — Listed
