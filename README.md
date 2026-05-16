# TaskPilot 🚀

**TaskPilot** is a high-performance, enterprise-grade Task and Project Management platform built with the **MERN stack** (MongoDB, Express, React, Node.js). It features a modern, high-fidelity user interface designed for maximum productivity and real-time team collaboration.

## ✨ Core Features

### 📊 Role-Based Intelligence
- **Admin Dashboard**: A high-level mission control featuring real-time team analytics, global activity feeds, and cross-project performance metrics.
- **Member Dashboard**: A personalized productivity hub focused on individual tasks, upcoming deadlines, and personal efficiency.

### 🔄 Real-Time Collaboration
- **Interactive Activity Feed**: Track every movement within the team with a descriptive, filterable timeline of status updates, comments, and task creations.
- **Team Presence**: Know who's online at a glance with live status indicators and interactive member tooltips.
- **Momentum Tracking**: Data-driven insights that summarize team achievements and sprint progress.

### 🛠️ Advanced Task Management
- **Structured Projects**: Organize work into high-level projects with dedicated progress tracking and member assignment.
- **Task Lifecycle**: Full CRUD support for tasks with priority levels (High/Medium/Low) and status states (To Do/In Progress/Completed).
- **Visual Deadlines**: Stay ahead with a dedicated deadlines widget featuring visual progress bars for urgent items.

### 🎨 Premium UI/UX
- **Glassmorphic Design**: A sleek, modern aesthetic using vibrant gradients, subtle micro-animations, and a responsive glassmorphism feel.
- **Performance Optimized**: Built with **Zustand** for lightning-fast state management and **Tailwind CSS** for ultra-responsive layouts.
- **Dark Mode Ready**: Fully compatible with modern design tokens for a premium experience in any environment.

## 🚀 Tech Stack
- **Frontend**: React 18, Zustand, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, JWT Authentication, bcrypt.
- **Database**: MongoDB (Mongoose ODM).

## 🛠️ Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. **Set up Environment Variables**: Create a `.env` in the server root with your `MONGO_URI` and `JWT_SECRET`.
4. **Seed the database**:
   ```bash
   node server/seed.js
   ```
5. **Run the app**:
   ```bash
   # Terminal 1 (Client)
   cd client && npm run dev
   
   # Terminal 2 (Server)
   cd server && npm run dev
   ```

---
*Built for teams that demand excellence. Master your workflow with TaskPilot.*
