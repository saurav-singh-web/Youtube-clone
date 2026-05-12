# YouTube Clone - MERN Stack Capstone Project

A fully functional, responsive YouTube clone built using the MERN (MongoDB, Express, React, Node.js) stack. This project features user authentication, video management (CRUD), channel customization, search functionality, and interactive comment sections.

## 🚀 Features

### Frontend (React + Vite + Tailwind CSS)
- **Home Page**: Dynamic video grid with search and category filtering.
- **Responsive Navigation**: Sticky header and toggleable sidebar that adapts across mobile, tablet, and desktop.
- **Authentication**: Secure JWT-based registration and login system with form validation.
- **Video Player**: High-performance video playback with like/dislike interactions.
- **Comment System**: Full CRUD (Create, Read, Update, Delete) support for comments on video pages.
- **Channel Dashboard**: Private dashboard for users to create a channel and manage (Upload/Edit/Delete) their videos.
- **Public Profiles**: View public channel pages for other creators.

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Well-structured API endpoints for users, videos, channels, and comments.
- **JWT Security**: Protected routes and token-based authentication.
- **Global Error Handling**: Robust error management using `express-async-errors`.
- **Database Modeling**: Optimized MongoDB schemas with Mongoose for efficient data retrieval.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router, Axios, Tailwind CSS, Lucide-React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens), Bcryptjs

---

## 📂 Project Structure

```text
YouTube Clone/
  backend/
    src/
      config/       # DB connection
      controllers/  # API logic
      middleware/   # Auth & Error handlers
      models/       # Mongoose schemas
      routes/       # API endpoints
      utils/        # Validators & Token helpers
  frontend/
    src/
      components/   # Reusable UI elements
      pages/        # Full-page views
      routes/       # App routing logic
      services/     # API integration (Axios)
      utils/        # Local storage helpers
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/saurav-singh-web/Youtube-clone.git
cd "YouTube Clone"
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://youtube-clone:m6YyIrDMzTZRpDip@cluster0.dxn1kxy.mongodb.net/youtube_clone?appName=Cluster0
JWT_SECRET=youtube_clone_dev_secret_change_before_deploy
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Running the Application
```bash
# Start backend server (from backend directory)
npm start

# Start frontend development server (from frontend directory)
npm run dev
```

---

## 🔑 Test Credentials

1. **Register**: Use the registration form to create your own account.
2. **Login**: Sign in with your registered email and password.
3. **Explore**: Create a channel to start uploading and managing your own videos!

---

## 📝 Author
**Saurav Singh** - [GitHub](https://github.com/saurav-singh-web)
