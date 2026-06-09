const express = require("express");
const router = express.Router();

const {
  createCourse,
  getTeacherCourses,
  getCourseById,
  getCourseWithModules,   // ✅ ADD THIS
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");

// CREATE COURSE
router.post("/create", protect, createCourse);

// GET ALL TEACHER COURSES
router.get("/my-courses", protect, getTeacherCourses);

// 🔥 IMPORTANT (must be before /:id)
router.get("/:id/full", protect, getCourseWithModules);

// GET SINGLE COURSE
router.get("/:id", protect, getCourseById);

// UPDATE COURSE
router.put("/:id", protect, updateCourse);

// DELETE COURSE
router.delete("/:id", protect, deleteCourse);

module.exports = router;