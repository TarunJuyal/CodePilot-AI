# 📌 CodePilot AI

Building AI-powered developer assistant built with **Next.js 15**, **Prisma**, **Vercel Postgres**, **NextAuth**, and **Hugging Face**.  
CodePilot helps you **review code, convert between languages, and generate epics & user stories** directly from project requirements.

---

## ✨ Features

- 🔑 **Authentication**

  - Secure login with **Google & GitHub** via NextAuth.
  - JWT-based sessions for scalability.

- 🧑‍💻 **Code Review Assistant**

  - Paste your code and get **AI-driven review feedback**.
  - Supports **custom prompts** for focused feedback.
  - Formatted output with text + code blocks.

- 🔄 **Code Conversion Tool**

  - Convert code between different languages (JS ↔ React, Java, Python, etc.).
  - AI models handle reverse engineering & refactoring.

- 📐 **Epic & Story Generator**

  - Generate **epics & subtasks** from plain project requirements.
  - JSON-structured output (feature, description, acceptance criteria, story points, difficulty).
  - Save projects to DB and manage CRUD (edit, delete epics & stories).
  - Export projects to **PDF** for sharing with teams.

- 🎨 **Modern UI/UX**
  - Built with **shadcn/ui** and **TailwindCSS**.
  - Dark & light themes with a switch toggle.
  - Responsive layouts for desktop & mobile.

---

## 🛠️ Tech Stack

- **Frontend** → [Next.js 15](https://nextjs.org/) + [React 19](https://react.dev/)
- **UI Library** → [shadcn/ui](https://ui.shadcn.com/) + [TailwindCSS 4](https://tailwindcss.com/)
- **Authentication** → [NextAuth.js](https://next-auth.js.org/) with Prisma adapter
- **Database** → [Prisma ORM](https://www.prisma.io/) + [Vercel Postgres](https://vercel.com/storage/postgres)
- **AI Integration** → [Hugging Face Inference API](https://huggingface.co/inference-api)
- **Icons** → [lucide-react](https://lucide.dev/)
- **Notifications** → [Sonner](https://sonner.emilkowal.ski/)

---

## 📁 Repository Structure

```
/
├── app/                # Next.js app directory (routes, pages, layouts)
│   ├── api/            # API route handlers (auth, code review, conversion, epics)
│   ├── components/     # Reusable React components (UI, forms, modals)
│   ├── Context/         # Context for custom promt
│   |── utils/          # Utility functions and helpers
│   └── hooks/          # Utility functions for effects
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets (images, icons, fonts)
├── scripts/            # Custom scripts (setup, seeding, maintenance)
├── .env.example        # Example environment variables
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

---

## ⚡ Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/codepilot-ai.git
   cd codepilot-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   - Copy `.env.example` to `.env.local` and fill in required values (database, NextAuth, Hugging Face API keys etc).

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 📚 Additional Details

- **API Keys Required:**

  - Hugging Face Inference API
  - Google & GitHub OAuth credentials
  - Vercel Postgres connection string

- **Deployment:**

  - Optimized for [Vercel](https://vercel.com/)
  - Environment variables managed via Vercel dashboard

- **License:**
  - [MIT](LICENSE)

---
