const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  }
},
{ timestamps: true }
);

// 🔥 ADD THIS (VERY IMPORTANT)
moduleSchema.virtual("materials", {
  ref: "Material",
  localField: "_id",
  foreignField: "module"
});

// 🔥 ALSO ADD THIS
moduleSchema.set("toObject", { virtuals: true });
moduleSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Module", moduleSchema);