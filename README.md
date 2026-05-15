# 🎓 Mentoro — Frontend

> A comprehensive, production‑grade Learning Management System (LMS) UI designed to offer an immersive, AI‑powered online education experience. Built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Cutting‑edge AI Integration**.

---

## 📖 About The Project

Mentoro bridges the gap between instructors and students by providing a seamless, interactive platform for **Mentoro** creation, discovery, and learning. It empowers educators with robust **Mentoro** management tools—such as dynamic creation forms, media uploads, and structured lessons—while offering students an intuitive dashboard and a 24/7 AI Mentor to aid their learning journey.

Whether you are looking to monetize your expertise or upskill with new knowledge, Mentoro provides the perfect ecosystem with built‑in payments, multi‑language support, and intelligent search capabilities.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏫 **Comprehensive Dashboards** | Dedicated intuitive dashboards for Students, Instructors, and Admins. |
| 📚 **Mentoro Management** | Powerful tools for instructors to create, edit, delete **Mentoro**, and structure modules and lessons. |
| ☁️ **Media Uploads** | Seamless image and video uploads integrated with Cloudinary for **Mentoro** thumbnails and previews. |
| 🤖 **AI Mentor & Quiz Gen** | Persistent 24/7 AI assistant for instant support and on‑the‑fly quiz generation to test knowledge. |
| 🔍 **Intelligent Search** | Semantic AI search with insights, smart **Mentoro** matching, and filtering capabilities. |
| 🌍 **Multi‑Language (i18n)** | Native support for multiple languages including English, Bengali, Arabic (RTL), French, and Spanish, powered by Intlayer & AI. |
| 💼 **Jobs & Careers Board** | Dedicated job portal for users to apply to platform careers, with admin application tracking. |
| 📹 **Live Sessions** | Integrated live session management for instructors to schedule and host real‑time classes. |
| 📊 **Advanced Analytics** | Comprehensive admin analytics dashboard with data visualization and CSV/PDF export capabilities. |
| ✉️ **Dynamic Contact Forms** | Fully functional contact pages utilizing EmailJS for reliable communication. |
| 💳 **Stripe Integration** | Seamless and secure payment flow for paid **Mentoro** enrollments. |
| 🔐 **Secure Authentication** | Firebase‑powered Email/Password and Google Social Login with state synced via Redux Toolkit. |
| 📱 **Responsive & Modern UI** | Mobile‑first design, beautiful toast notifications (`react‑hot‑toast`), interactive maps (`react‑leaflet`), and full RTL layout support for Arabic users. |

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) for SSR and routing |
| **React Hook Form & Zod** | Dynamic, validated, and performant forms |
| **Redux Toolkit (RTK Query)** | State management and efficient data fetching |
| **Tailwind CSS 4** | Utility‑first styling for a highly customizable UI |
| **Firebase** | Authentication (Email/Google) |
| **Intlayer 8.6 & OpenRouter** | AI‑Driven Content Management and Automated Translations |
| **Stripe** | Payment processing |
| **EmailJS** | Client‑side email sending |
| **React Hot Toast** | Beautiful, lightweight global notifications |
| **React Leaflet** | Interactive mapping for contact sections |
| **Lucide React** | Modern, clean iconography |

---

## ⚡ Quick Start

### Prerequisites
- Node.js v20+
- **pnpm** (Preferred package manager)

### 1. Clone & Install
```bash
git clone https://github.com/dev-alauddin-bd/Mentoro_Frontend.git
cd Mentoro_Frontend
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENROUTER_API_KEY=your_openrouter_key_here
```

### 3. Internationalization (AI Translation)
```bash
# Fill missing translations using OpenRouter AI
npx intlayer fill
# Build JSON dictionaries
npx intlayer build
```

### 4. Run Development Server
```bash
pnpm dev
```

---

## 🛣️ Core Routes

| Route | Description | Accessibility |
|---|---|---|
| `/` | Landing Page showcasing platform features and top **Mentoro** | Public |
| `/mentoro` | Browse, search, and filter the **Mentoro** catalog | Public |
| `/mentoro/[id]` | Detailed **Mentoro** view, curriculum, and enrollment | Public |
| `/careers` | View and apply for open job positions | Public |
| `/contact` | Get in touch with platform support via interactive forms | Public |
| `/login` & `/signup` | Secure authentication flows | Public |
| `/dashboard/student/*` | Student progress and enrolled **Mentoro** | Protected |
| `/dashboard/instructor/*` | Instructor **Mentoro** management, assignments, modules, and live sessions | Protected |
| `/dashboard/admin/*` | Platform administration, advanced analytics, user management, and job postings | Protected |

---

<p align="center">
  <b>Built with ❤️ and AI for modern education.</b>
</p>
