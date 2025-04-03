#!/bin/bash

# Create project directories
mkdir -p college-attendance-system
cd college-attendance-system

# Create server directory structure
mkdir -p server/src/config
mkdir -p server/src/controllers
mkdir -p server/src/middleware
mkdir -p server/src/models
mkdir -p server/src/routes

# Create client directory structure
mkdir -p client/src/components/ui
mkdir -p client/src/components/layout
mkdir -p client/src/context
mkdir -p client/src/lib
mkdir -p client/src/pages/student
mkdir -p client/src/pages/faculty
mkdir -p client/src/pages/admin

# Create server .env file
cat > server/.env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=college_attendance
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
EOF

# Create client .env file
cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF

# Initialize server package.json
cd server
npm init -y
npm install express cors mysql2 bcrypt jsonwebtoken dotenv
npm install --save-dev nodemon
cd ..

# Initialize client with React
cd client
npx create-react-app .
npm install react-router-dom axios framer-motion jwt-decode tailwindcss postcss autoprefixer tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-slot recharts
npm install -D @types/node
cd ..

echo "Project structure created successfully!" 