# 🚀 Premium Task Management App (Full-Stack)

A production-ready, high-performance task management application built for technical assessment.

## 🛠️ Tech Stack
- **Backend**: Node.js (Express)
- **Frontend**: React (Vite) + Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Authentication**: JWT with secure HttpOnly cookies

## ✨ Core Features
- **Secure Auth**: Hashed passwords (bcrypt) and JWT-based session management.
- **Task Lifecycle**: 3-step status cycle (Todo -> In Progress -> Done).
- **Security**: 
  - AES-256-CBC encryption for sensitive response payloads.
  - Full Joi input validation on all API endpoints.
  - Row-level authorization (users can only access their own data).
- **Performance**: 
  - Server-side pagination.
  - Real-time search and status filtering.
- **Aesthetics**: Premium Glassmorphism UI with micro-animations.

## 🚀 Local Setup

1. **Clone the repo**
2. **Setup Env Variables**: Create a `.env` file in the root:
   ```env
   PORT=5000
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   PRISMA_DATABASE_URL=your_postgres_url
   JWT_SECRET=your_secret
   ```
3. **Install & Run**:
   ```bash
   npm install
   cd frontend && npm install
   cd ..
   npm run dev:all
   ```

## 🌐 Deployment
- **Database**: Supabase
- **Hosting**: Railway / Vercel
