# 🎓 CourseMaster — Frontend

> A comprehensive, production-grade Learning Management System (LMS) UI designed to offer an immersive, AI-powered online education experience. Built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Cutting-edge AI Integration**.

---

## 📖 About The Project

CourseMaster bridges the gap between instructors and students by providing a seamless, interactive platform for course creation, discovery, and learning. It empowers educators with robust course management tools—such as dynamic creation forms, media uploads, and structured lessons—while offering students an intuitive dashboard, personalized recommendations, and a 24/7 AI Mentor to aid their learning journey.

Whether you are looking to monetize your expertise or upskill with new knowledge, CourseMaster provides the perfect ecosystem with built-in payments, multi-language support, and intelligent search capabilities.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏫 **Comprehensive Dashboards** | Dedicated intuitive dashboards for Students, Instructors, and Admins. |
| 📚 **Course Management** | Powerful tools for instructors to create, edit, delete courses, and structure modules and lessons. |
| ☁️ **Media Uploads** | Seamless image and video uploads integrated with Cloudinary for course thumbnails and previews. |
| 🤖 **AI Mentor & Quiz Gen** | Persistent 24/7 AI assistant for instant support and on-the-fly quiz generation to test knowledge. |
| 🔍 **Intelligent Search** | Semantic AI search with insights, smart course matching, and filtering capabilities. |
| 🎯 **Smart Recommendations** | Personalized course recommendations based on user history and preferences. |
| 🌍 **Multi-Language (i18n)** | Native support for multiple languages including English, Bengali, Arabic (RTL), French, and Spanish, powered by Intlayer & AI. |
| 💳 **Stripe Integration** | Seamless and secure payment flow for paid course enrollments. |
| 🔐 **Secure Authentication** | Firebase-powered Email/Password and Google Social Login with state synced via Redux Toolkit. |
| 📱 **Responsive & Modern UI** | Mobile-first design, beautiful animations, and full RTL layout support for Arabic users. |

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) for SSR and routing |
| **React Hook Form & Zod** | Dynamic, validated, and performant forms |
| **Redux Toolkit (RTK Query)** | State management and efficient data fetching |
| **Tailwind CSS 4** | Utility-first styling for a highly customizable UI |
| **Firebase** | Authentication (Email/Google) |
| **Intlayer 8.6 & OpenRouter** | AI-Driven Content Management and Automated Translations |
| **Stripe** | Payment processing |
| **Lucide React** | Modern, clean iconography |

---

## ⚡ Quick Start

### Prerequisites
- Node.js v20+
- **pnpm** (Preferred package manager)

### 1. Clone & Install
```bash
git clone https://github.com/dev-alauddin-bd/Course_Master_Frontend.git
cd Course_Master_Frontend
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
Generate or update translations using Intlayer:
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
| `/` | Landing Page showcasing platform features and top courses | Public |
| `/courses` | Browse, search, and filter the course catalog | Public |
| `/courses/[id]` | Detailed course view, curriculum, and enrollment | Public |
| `/login` & `/signup` | Secure authentication flows | Public |
| `/dashboard/student/*` | Student progress, enrolled courses, and recommendations | Protected |
| `/dashboard/instructor/*` | Instructor course management, assignments, and modules | Protected |
| `/dashboard/admin/*` | Platform administration and refund policy management | Protected |

---

<p align="center">
  <b>Built with ❤️ and AI for modern education.</b>
</p>
