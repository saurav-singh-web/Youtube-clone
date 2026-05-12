# YouTube Clone

MERN stack capstone project built step by step.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Project Structure

```text
YouTube Clone/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
  frontend/
    src/
      assets/
      components/
      pages/
      services/
```

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <repository_url>
cd "YouTube Clone"
\`\`\`

### 2. Environment Variables
Create a \`.env\` file in the \`backend\` directory with the following variables:
\`\`\`env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
\`\`\`

### 3. Install Dependencies
For the backend:
\`\`\`bash
cd backend
npm install
\`\`\`

For the frontend:
\`\`\`bash
cd frontend
npm install
\`\`\`

### 4. Running the Application
To run the backend server:
\`\`\`bash
cd backend
npm run dev
\`\`\`

To run the frontend app:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### 5. Seed Database (Optional)
To test with sample data, you can create a script or add some mock data directly via MongoDB compass.

### 6. Test Credentials
Use the registration form to create a new user and login, or use existing seeded credentials if available.
