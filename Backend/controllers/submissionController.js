const Submission = require("../models/submissionModel");
const Quiz = require("../models/quizModel");
const Assignment = require("../models/assignmentModel");


// ========================================
// ➕ CREATE SUBMISSION (Student)
// ========================================
exports.createSubmission = async (req, res) => {
  try {
    const { type, course, assignment, quiz, content, answers } = req.body;

    // 🔒 Only students can submit
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit" });
    }

    // ✅ Basic validation
    if (!type || !course) {
      return res.status(400).json({ message: "Type and course are required" });
    }

    if (type === "assignment" && !assignment) {
      return res.status(400).json({ message: "Assignment ID required" });
    }

    if (type === "quiz" && !quiz) {
      return res.status(400).json({ message: "Quiz ID required" });
    }

    // 🚫 Prevent duplicate submission
    const existing = await Submission.findOne({
      student: req.user.id,
      course,
      ...(type === "quiz" ? { quiz } : { assignment })
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    let score = null;
    let status = "submitted";

    // ========================================
    // 🔥 QUIZ AUTO-GRADING
    // ========================================
    if (type === "quiz") {
      const quizData = await Quiz.findById(quiz);

      if (!quizData) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      if (!answers || answers.length !== quizData.questions.length) {
        return res.status(400).json({
          message: "Answers must match number of questions"
        });
      }

      score = 0;

      quizData.questions.forEach((q, i) => {
        if (q.correctAnswer === answers[i]) {
          score++;
        }
      });

      status = "graded"; // quiz auto-graded
    }

    // ========================================
    // 📝 ASSIGNMENT VALIDATION + LATE CHECK
    // ========================================
    if (type === "assignment") {
      const assignmentData = await Assignment.findById(assignment);

      if (!assignmentData) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      if (!content) {
        return res.status(400).json({
          message: "Content is required for assignment"
        });
      }

      // ⏰ Late submission logic
      if (assignmentData.deadline && new Date() > assignmentData.deadline) {
        status = "late";
      }
    }

    // ========================================
    // ✅ CREATE
    // ========================================
    const submission = await Submission.create({
      type,
      course,
      assignment,
      quiz,
      student: req.user.id,
      content,
      answers,
      score,
      status
    });

    res.status(201).json({
      message: "Submission created successfully",
      submission
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to create submission",
      error: err.message
    });
  }
};



// ========================================
// 📥 GET SUBMISSIONS BY COURSE (Teacher)
// ========================================
exports.getSubmissionsByCourse = async (req, res) => {
  try {
    const submissions = await Submission.find({
      course: req.params.courseId
    })
      .populate("student", "name email")
      .populate("assignment", "title")
      .populate("quiz", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch submissions",
      error: err.message
    });
  }
};



// ========================================
// 📥 GET SUBMISSIONS BY ASSIGNMENT
// ========================================
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch assignment submissions",
      error: err.message
    });
  }
};



// ========================================
// 📥 GET SUBMISSIONS BY QUIZ
// ========================================
exports.getSubmissionsByQuiz = async (req, res) => {
  try {
    const submissions = await Submission.find({
      quiz: req.params.quizId
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch quiz submissions",
      error: err.message
    });
  }
};



// ========================================
// 🔍 GET SINGLE SUBMISSION
// ========================================
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("student", "name email")
      .populate("assignment", "title")
      .populate("quiz", "title");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(submission);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch submission",
      error: err.message
    });
  }
};



// ========================================
// ✏️ GRADE SUBMISSION (Teacher)
// ========================================
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teacher allowed" });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.score = score ?? submission.score;
    submission.feedback = feedback ?? submission.feedback;
    submission.status = "graded";

    await submission.save();

    res.json({
      message: "Submission graded successfully",
      submission
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to grade submission",
      error: err.message
    });
  }
};