const express = require("express");
const cors = require("cors");
require("dotenv").config(); // load .env variables

const connectDB = require("./config/db"); // MongoDB connection
const authRoutes = require("./routes/authRoutes");

const app = express();

// --- Connect Database ---
connectDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);


const assignmentRoutes = require("./routes/assignmentRoutes");
app.use("/api/assignments", assignmentRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quizzes", quizRoutes);


const submissionRoutes = require("./routes/submissionRoutes");
app.use("/api/submissions", submissionRoutes);

const materialRoutes = require("./routes/materialRoutes");
app.use("/api/materials", materialRoutes);
// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api/modules", require("./routes/moduleRoutes"));

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});