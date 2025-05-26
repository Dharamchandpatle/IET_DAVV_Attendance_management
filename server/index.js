require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
// const errorMiddleware = require("./middleware/errorMiddleware");
const classAttendanceRoutes = require("./routes/classAttendanceRoutes");
// const examAttendanceRoutes = require("./routes/examAttendanceRoutes");
const router = express.Router();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API Routes
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes );
app.use("/api/class-attendance", classAttendanceRoutes); // Class attendance ke liye
// app.use("/api/exam-attendance", examAttendanceRoutes);   // Exam attendance ke liye

// Error handling middleware
// app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});