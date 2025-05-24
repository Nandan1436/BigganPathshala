# Team DU_CodeSynthesis

## Team Members

- **Mohammad Ismail Hossain**
- **Nandan Bhowmick**
- **Md. Mahfuz Ibne Ali Ayon**


[GitHub Repository](https://github.com/CodeWithIsmail/BigganPathshala)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Live Demo](#live-demo)
- [Problem & Solution](#problem--solution)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Development Strategy](#development-strategy)
- [Getting Started](#getting-started)
- [Future Roadmap](#future-roadmap)
- [Contribution Guide](#contribution-guide)
- [License](#license)

---


## ✨ Project Overview

**Biggan Pathshala** is a modern, interactive, and fully localized science tutorial, blog, and quiz platform. Students can learn science in simple language, ask questions, and create or share their own content. The platform blends the interactivity of social media with the depth of a knowledge-sharing hub.

---

## 🔗 Live Demo

Check out the original hosted version of **Biggan Pathshala** here:  
[https://bigganpathshala.vercel.app/](https://bigganpathshala.vercel.app/)

---

## 🚩 Problem & Solution

Many students in Bangladesh and beyond struggle to connect with science due to a lack of engaging, localized resources and supportive communities. There is no central space for learning, asking, and contributing knowledge in Bangla or English in a simple, interactive way.

**Our Solution:**

- Peer-to-peer science Q&A inspired by Facebook and StackOverflow
- Publish tutorials/blogs on science topics (school to university level)
- AI-powered features: auto-answering science questions, summarizing blogs/tutorials
- Gamification: learning score, reputation, contribution
- Support for both Bangla and English content
- Friendly, collaborative, and open-source environment

---

## 🌟 Key Features

### ❓ Ask & Answer

- Post science questions and receive answers from peers or AI
- Tag/category filtering, upvote/downvote, comments, real-time updates
- Reputation system for voting on questions and answers

### 📚 Tutorials & Blogs

- Anyone can post, read, or summarize science blogs/tutorials
- Rich text, images, tags, author username only (privacy-first)
- Advanced filtering: by tag, author, date, rating, "My Tutorials", "Best Tutorials"
- Card/grid layout, intuitive navigation
- AI-powered blog/tutorial summarization

### 📝 Rating & Review

- One review per user per tutorial (rating + comment required)
- Authors cannot review their own tutorials
- Average rating and review count displayed

### 🧠 Quiz System

- Auto-generated quizzes (easy, medium, hard) for each tutorial
- One attempt per user per level
- Color-coded feedback, score breakdown, and result analysis
- Quiz results saved to user profile

### 👤 User Profiles & Gamification

- Firebase Auth login/signup
- Unique username, profile picture (upload & preview), bio, interests (select/custom)
- Track blogs, tutorials, comments; reputation, contribution, and learning scores (progress bars & titles)
- Profile editing, add/remove interests

### 🌐 Feed & Blog

- Science feed: posts, tags, images, Bangla TTS (listen), AI summaries, real-time reactions (like/dislike)
- Fact-checked/featured posts, comments

### 🔍 Search & Filter

- Filter by author, tag, title, date, "My Tutorials", "Best Tutorials"
- Fully localized user interface

### 🔒 Security & Privacy

- Only username is public; email/full name never exposed

---

## 🛠️ System Architecture

- **Frontend:** React.js (Vite), Tailwind CSS, Tiptap Editor
- **Backend:** Firebase (Auth, Firestore)
- **AI Integration:** Gemini API (Auto-answer, Summarization)
- **Deployment:** Vercel

## 🛠️ Tech Stack

| Frontend                              | Backend                    | AI         | Deployment |
| ------------------------------------- | -------------------------- | ---------- | ---------- |
| React.js (Vite, Tiptap, Tailwind CSS) | Firebase (Auth, Firestore) | Gemini API | Vercel     |

---

## 🧩 Development Strategy

- **Component-based Design:** Each feature is a separate React component
- **Clean, Readable Code:** Well-commented, documented, and follows conventions
- **Responsive & Accessible UI:** Tailwind CSS and custom design
- **Data Security:** Only username is public, never email/full name
- **Maximum Localization:** All UI, messages, and tooltips are localized

---

> **Personal Contributions:**  
> I worked primarily on the **User Profile** and **Q&A components** to enhance user interactivity and profile management features.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/CodeWithIsmail/BigganPathshala.git
cd BigganPathshala/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 📸 Screenshots

See [`screenshots.md`](screenshots.md) for visuals of the platform.

---


## 🛣️ Future Roadmap

- Enhanced profile pictures and bios
- Leaderboard and follow system
- Advanced quiz generation and analytics
- Offline mode
- Mobile app
- Accessibility: screen reader, voice navigation, adjustable font/contrast
- Community moderation and safety
- Notification system

---
