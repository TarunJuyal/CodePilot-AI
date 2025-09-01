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

