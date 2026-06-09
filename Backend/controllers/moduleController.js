const Module = require("../models/moduleModel");

exports.createModule = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        message: "Title and courseId required"
      });
    }

    const module = await Module.create({
      title,
      course: courseId
    });

    res.status(201).json({
      message: "Module created successfully",
      module
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};