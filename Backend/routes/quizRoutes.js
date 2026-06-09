const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion
} = require("../controllers/quizController");

const protect = require("../middleware/authMiddleware");

// ================= QUIZ CRUD =================

// CREATE
router.post("/create", protect, createQuiz);

// GET ALL (by course)
router.get("/course/:courseId", protect, getQuizzesByCourse);

// GET ONE
router.get("/:id", protect, getQuizById);

// UPDATE QUIZ
router.put("/:id", protect, updateQuiz);

// DELETE QUIZ
router.delete("/:id", protect, deleteQuiz);


// ================= QUESTION CRUD =================

// ➕ Add Question
router.post("/:id/add-question", protect, addQuestion);

// ✏️ Update Question
router.put("/:id/update-question/:questionId", protect, updateQuestion);

// ❌ Delete Question
router.delete("/:id/delete-question/:questionId", protect, deleteQuestion);


module.exports = router;