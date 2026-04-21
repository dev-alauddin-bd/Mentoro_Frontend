# 🎓 CourseMaster — Frontend

> A stunning, production-grade online learning platform UI — built with **Next.js 16**, **React 19**, and **Cutting-edge AI Integration**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Mentor** | Persistent 24/7 AI assistant for instant student support |
| 🔍 **Intelligent Search** | Semantic AI search with insights and smart course matching |
| 📝 **AI Quiz Gen** | On-the-fly quiz generation for any lesson to test knowledge |
| 🎯 **Smart Recs** | Personalized course recommendations based on user history |
| 🌐 **AI i18n** | Automated translations using **Intlayer** + **OpenRouter (Llama 3.3)** |
| 🌍 **Multi-Language** | Native support for **English, Bengali, Arabic (RTL), French, and Spanish** |
| 🏠 **Landing Page** | Hero section, featured courses, testimonials, trust bar |
| 💳 **Stripe Checkout** | Seamless payment flow for paid courses |
| 📱 **Fully Responsive** | Mobile-first, including **RTL layout support** for Arabic |

---

## 🚀 AI-Powered Experience

CourseMaster is now equipped with advanced AI features to enhance the learning journey:

- **AI Mentor:** A chatbot available on every page to help students with course-related queries in real-time.
- **Intelligent Semantic Search:** Beyond keyword matching, our AI understands intent to provide detailed insights and find the perfect courses.
- **Dynamic Quiz Generator:** Automatically creates relevant multiple-choice questions for any lesson, helping students validate their learning.
- **Personalized Recommendations:** An AI-driven dashboard component that suggests courses tailored to individual student interests and past activity.

---

## ⚡ Quick Start

### Prerequisites
- Node.js v20+
- **pnpm** (Preferred package manager)

### 1. Clone & Install
```bash
git clone <repo-url>
cd courseMaster-frontend
pnpm install
```

### 2. Environment Variables
Create a `.env` file:
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

## 🧪 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (App Router) |
| Intlayer 8.6 | AI-Driven Content Management |
| OpenRouter | AI Provider (Llama 3.3 / Gemma) |
| LangChain | RAG and AI Orchestration (Backend) |
| Redux Toolkit | State management & AI API Integration |
| Tailwind CSS 4 | Utility-first styling |

---

## 📱 Multi-Language Support (i18n)
This project uses a hybrid approach for translations:
1. **Intlayer:** Manages content dictionaries and uses OpenRouter AI to automatically translate strings.
2. **i18next:** Handles client-side switching and persistence.
3. **RTL Support:** Automatic layout flipping for Arabic using `dir="rtl"`.

---

Built with ❤️ and AI for CourseMaster


