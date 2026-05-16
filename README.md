# TaskPilot 🚀 | Modern Enterprise Task Management

**TaskPilot** is a high-fidelity, high-performance task management platform designed for modern teams. Built with a focus on speed, aesthetics, and user experience, it provides a seamless workflow for project tracking, team collaboration, and administrative oversight.

![TaskPilot Preview](https://task-manager-tan-mu-16.vercel.app/og-image.png) *(Note: Add your actual screenshot here later)*

---

## 🔗 Live Demo
Access the production portal here: **[https://task-manager-tan-mu-16.vercel.app/](https://task-manager-tan-mu-16.vercel.app/)**

### 🔑 Demo Credentials
To explore the dual-role functionality, use the following credentials:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@taskpilot.com` | `123456` |
| **Member** | `tasker@taskpilot.com` | `123456` |

---

## ✨ Key Features

### 📊 Role-Based Dashboards
- **Admin Mission Control**: Real-time team analytics, global activity feeds, and cross-project performance metrics. Admins can manage the entire team, oversee all projects, and monitor global deadlines.
- **Member Productivity Hub**: A focused experience for individual contributors. View assigned tasks, upcoming deadlines, and personal progress metrics.

### 📋 Advanced Project & Task Management
- **Interactive Kanban Board**: A drag-and-drop style interface for moving tasks through `To Do`, `In Progress`, and `Done` states.
- **Project Workspaces**: Dedicated boards for specific projects with member-only access and milestone tracking.
- **Task Richness**: Support for priorities (High/Medium/Low), due dates, and real-time threaded comments.

### 👥 Team & Security
- **Team Management**: Admins can invite new members, assign roles (Admin/Member), and manage the overall team structure.
- **Profile Customization**: Users can update their professional profiles, including name, email, and profile photos (supporting high-quality Base64 uploads).
- **Secure Authentication**: Built with JWT (JSON Web Tokens) and secure session management.

### 🎨 Premium Aesthetics
- **State-of-the-art UI**: A minimalist, high-contrast design featuring glassmorphism effects, smooth gradients, and micro-animations.
- **Responsive Layout**: Optimized for desktop, tablet, and mobile views.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Zustand (Global Store)
- **Styling**: Tailwind CSS (Utility-first)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend & Infrastructure
- **Server**: Node.js & Express.js
- **Database**: 
  - **Local**: SQLite (for development speed and portability)
  - **Production**: In-memory Mock API (optimized for Vercel Serverless)
- **Deployment**: Vercel (CI/CD)

---

## 🛠️ Local Development Setup

Follow these steps to get TaskPilot running on your local machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshhh01523/TaskPilot.git
   cd TaskPilot
   ```

2. **Install Root Dependencies**
   ```bash
   npm install
   ```

3. **Install Client & Server Dependencies**
   ```bash
   npm run install-all
   ```

4. **Setup Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

5. **Seed the Local Database**
   ```bash
   cd server && node seed.js && cd ..
   ```

6. **Run the Application**
   ```bash
   npm run dev
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend will run on: `http://localhost:5000`

---

## 📂 Project Structure

```text
├── api/                # Vercel Serverless Mock Backend
├── client/             # Vite + React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   │   ├── store/      # Zustand state management
│   │   └── lib/        # API and helper configurations
├── server/             # Node.js + Express Backend (Local)
│   ├── routes/         # API Route definitions
│   └── models/         # Database models
└── vercel.json         # Vercel Deployment configuration
```

---

*Built with passion for high-performance teams. Master your workflow with TaskPilot.*
