const Course = require("../models/Course"); // ⚠️ match your filename

// ========================================
// 📌 CREATE COURSE
// ========================================
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const course = await Course.create({
      title,
      description,
      teacher: req.user.id
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// 📥 GET ALL COURSES OF TEACHER
// ========================================
exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      count: courses.length,
      courses
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// 📥 GET SINGLE COURSE BY ID
// ========================================
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.json(course);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// ✏️ UPDATE COURSE
// ========================================
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔐 Authorization
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;

    const updatedCourse = await course.save();

    res.json({
      message: "Course updated successfully",
      course: updatedCourse
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// ❌ DELETE COURSE
// ========================================
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔐 Authorization
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.deleteOne();

    res.json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const Module = require("../models/moduleModel");

exports.getCourseWithModules = async (req, res) => {
  try {
    const courseId = req.params.id;

    const modules = await Module.find({ course: courseId })
      .populate("materials")
      .sort({ createdAt: 1 });

    const course = await Course.findById(courseId);

    res.json({
      course,
      modules
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};