const Assignment = require("../models/assignmentModel");

exports.createAssignment = async (req, res) => {
  try {

    const { title, description, course, deadline } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      course,
      deadline,
      teacher: req.user.id
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAssignmentsByCourse = async (req, res) => {
  try {

    const assignments = await Assignment.find({
      course: req.params.courseId
    });

    res.json({
      count: assignments.length,
      assignments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTeacherAssignments = async (req, res) => {
  try {

    const assignments = await Assignment.find({
      teacher: req.user.id
    }).populate("course", "title");

    res.json({
      count: assignments.length,
      assignments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateAssignment = async (req, res) => {
  try {

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if the logged-in teacher owns the assignment
    if (assignment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    assignment.title = req.body.title || assignment.title;
    assignment.description = req.body.description || assignment.description;
    assignment.deadline = req.body.deadline || assignment.deadline;

    const updatedAssignment = await assignment.save();

    res.json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteAssignment = async (req, res) => {
  try {

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check teacher ownership
    if (assignment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await assignment.deleteOne();

    res.json({
      message: "Assignment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};