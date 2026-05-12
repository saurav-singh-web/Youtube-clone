git reset

# 1
git add .gitignore
git commit -m "Project initialization and .gitignore setup"

# 2
git add README.md
git commit -m "Add project README with setup instructions"

# 3
git add backend/package.json
git commit -m "Initialize backend Node.js environment"

# 4
git add backend/src/server.js
git commit -m "Add backend server setup and error handling middleware"

# 5
git add backend/src/config/db.js
git commit -m "Add MongoDB connection configuration"

# 6
git add backend/src/models/User.js
git commit -m "Create User model with password hashing for MongoDB"

# 7
git add backend/src/models/Video.js
git commit -m "Create Video model with like/dislike arrays for MongoDB"

# 8
git add backend/src/models/Channel.js
git commit -m "Create Channel model for MongoDB"

# 9
git add backend/src/models/Comment.js
git commit -m "Create Comment model for MongoDB"

# 10
git add backend/src/utils/validators.js
git commit -m "Add validation utilities for user inputs"

# 11
git add backend/src/middleware/authMiddleware.js
git commit -m "Implement authentication middleware for JWT validation"

# 12
git add backend/src/controllers/authController.js
git commit -m "Add auth controller for user registration and login"

# 13
git add backend/src/routes/authRoutes.js
git commit -m "Create authentication API routes"

# 14
git add backend/src/controllers/videoController.js
git commit -m "Implement video controller for full CRUD operations"

# 15
git add backend/src/routes/videoRoutes.js
git commit -m "Create video management API routes"

# 16
git add backend/src/controllers/channelController.js
git commit -m "Implement channel controller functionality"

# 17
git add backend/src/routes/channelRoutes.js
git commit -m "Create channel API routes"

# 18
git add backend/src/controllers/commentController.js
git commit -m "Implement comment controller for video interactions"

# 19
git add backend/src/routes/commentRoutes.js
git commit -m "Create comment API routes"

# 20
git add backend/.env.example
git commit -m "Add environment variables example template"

# 21
git add backend/scripts/
git commit -m "Add database seeding scripts for initial data"

# 22
git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit -m "Initialize React frontend with Vite"

# 23
git add frontend/src/main.jsx frontend/src/App.jsx
git commit -m "Setup frontend main entry and routing structure"

# 24
git add frontend/src/styles.css
git commit -m "Configure Tailwind CSS and global styles"

# 25
git add frontend/src/services/api.js frontend/src/utils/auth.js
git commit -m "Add API Axios service and auth utilities"

# 26
git add frontend/src/data/categories.js
git commit -m "Add dynamic video category data"

# 27
git add frontend/src/components/Header.jsx
git commit -m "Implement responsive Header component with search"

# 28
git add frontend/src/components/Sidebar.jsx
git commit -m "Implement toggleable responsive Sidebar component"

# 29
git add frontend/src/components/VideoCard.jsx
git commit -m "Create VideoCard component for home page thumbnails"

# 30
git add frontend/src/components/FilterBar.jsx
git commit -m "Implement FilterBar component for video categories"

# 31
git add frontend/src/pages/LoginPage.jsx
git commit -m "Create user Login page with JWT handling"

# 32
git add frontend/src/pages/RegisterPage.jsx
git commit -m "Create Register page with confirm password validation"

# 33
git add frontend/src/pages/HomePage.jsx
git commit -m "Implement Home page with video grid and responsive layout"

# 34
git add frontend/src/pages/ChannelPage.jsx
git commit -m "Create Channel page for private video management CRUD"

# 35
git add frontend/src/pages/PublicChannelPage.jsx
git commit -m "Add Public Channel page for viewing channel content"

# 36
git add frontend/src/pages/VideoPage.jsx
git commit -m "Implement Video player page with comments and likes"

# 37
git add .
git commit -m "Final polish and lockfile updates"

# Link to origin and push
git remote add origin https://github.com/saurav-singh-web/Youtube-clone.git
git branch -M main
git push -u origin main
