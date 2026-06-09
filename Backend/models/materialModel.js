const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },

  type: {
    type: String,
    enum: ["file", "link"],
    required: true
  },

  fileUrl: String,
  linkUrl: String,

  fileType: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Material", materialSchema);