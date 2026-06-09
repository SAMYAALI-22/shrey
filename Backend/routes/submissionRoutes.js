const express = require("express");
const router = express.Router();

const {
  createSubmission,
  getSubmissionsByCourse,
  getSubmissionsByAssignment,
  getSubmissionsByQuiz,
  getSubmissionById,
  gradeSubmission
} = require("../controllers/submissionController");

const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");


// ========================================
// 🎓 STUDENT ROUTES
// ========================================

// Only student can submit
router.post(
  "/",
  protect,
  authorize("student"),
  createSubmission
);


// ========================================
// 👨‍🏫 TEACHER / ADMIN ROUTES
// ========================================

// View submissions (teacher + admin)
router.get(
  "/course/:courseId",
  protect,
  authorize("teacher", "admin"),
  getSubmissionsByCourse
);

router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("teacher", "admin"),
  getSubmissionsByAssignment
);

router.get(
  "/quiz/:quizId",
  protect,
  authorize("teacher", "admin"),
  getSubmissionsByQuiz
);

// Single submission
router.get(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  getSubmissionById
);

// Grade submission
router.put(
  "/:id/grade",
  protect,
  authorize("teacher", "admin"),
  gradeSubmission
);

module.exports = router;