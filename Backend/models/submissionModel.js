const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["assignment", "quiz"],
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      default: null
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      default: null
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Assignment submission
    content: {
      type: String,
      default: ""
    },

    // Quiz answers
    answers: [
      {
        type: Number
      }
    ],

    score: {
      type: Number,
      default: null
    },

    feedback: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["submitted", "late", "graded"],
      default: "submitted"
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);


// ✅ Prevent duplicate submissions
submissionSchema.index(
  { student: 1, assignment: 1 },
  { unique: true, partialFilterExpression: { assignment: { $ne: null } } }
);

submissionSchema.index(
  { student: 1, quiz: 1 },
  { unique: true, partialFilterExpression: { quiz: { $ne: null } } }
);


// ✅ FIXED Validation (NO next)
submissionSchema.pre("save", function () {
  if (this.type === "assignment" && !this.assignment) {
    throw new Error("Assignment ID required for assignment submission");
  }

  if (this.type === "quiz" && !this.quiz) {
    throw new Error("Quiz ID required for quiz submission");
  }
});

module.exports = mongoose.model("Submission", submissionSchema);