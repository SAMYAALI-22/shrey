const Quiz = require("../models/quizModel");

// ✅ CREATE QUIZ
exports.createQuiz = async (req, res) => {
  try {
    const { title, course, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      course,
      questions,
      createdBy: req.user.id
    });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET QUIZ BY COURSE
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE QUIZ
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE QUIZ
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE QUIZ
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//question crud

exports.addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 🔒 Authorization
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    quiz.questions.push({
      question,
      options,
      correctAnswer
    });

    await quiz.save();

    res.status(201).json(quiz);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const q = quiz.questions.id(req.params.questionId);

    if (!q) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question) q.question = question;
    if (options) q.options = options;
    if (correctAnswer !== undefined) q.correctAnswer = correctAnswer;

    await quiz.save();

    res.json(quiz);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const q = quiz.questions.id(req.params.questionId);

    if (!q) {
      return res.status(404).json({ message: "Question not found" });
    }

    q.remove();

    await quiz.save();

    res.json({ message: "Question deleted", quiz });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};