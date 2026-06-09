const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignmentsByCourse,
  getTeacherAssignments,
  updateAssignment,
  deleteAssignment
} = require("../controllers/assignmentController");

const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createAssignment);
router.get("/course/:courseId", protect, getAssignmentsByCourse);
router.get("/my-assignments", protect, getTeacherAssignments);
router.put("/:id", protect, updateAssignment);
router.delete("/:id", protect, deleteAssignment);

module.exports = router;