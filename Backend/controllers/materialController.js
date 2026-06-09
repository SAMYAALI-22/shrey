const Material = require("../models/materialModel");

// ========================================
// 📤 UPLOAD MATERIAL
// ========================================
exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, module, type, linkUrl } = req.body;

    // 🔍 DEBUG (remove later)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const normalizedType = type?.toLowerCase();

    // ✅ Validation
    if (!title || !module || !normalizedType) {
      return res.status(400).json({
        message: "Title, module and type are required",
        received: req.body
      });
    }

    if (!["file", "link"].includes(normalizedType)) {
      return res.status(400).json({
        message: "Type must be either 'file' or 'link'"
      });
    }

    let fileUrl = "";
    let fileType = "";

    // 📁 FILE UPLOAD
    if (normalizedType === "file") {
      if (!req.file) {
        return res.status(400).json({
          message: "File is required"
        });
      }

      fileUrl = `/uploads/${req.file.filename}`;
      const mime = req.file.mimetype;

      if (mime === "application/pdf") fileType = "pdf";
      else if (mime.startsWith("video/")) fileType = "video";
      else if (mime.startsWith("audio/")) fileType = "audio";
      else if (
        mime === "application/msword" ||
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) fileType = "doc";
      else if (mime.startsWith("image/")) fileType = "image";
      else fileType = "other";
    }

    // 🔗 LINK UPLOAD
    if (normalizedType === "link") {
      if (!linkUrl) {
        return res.status(400).json({
          message: "Link URL required"
        });
      }
    }

    const material = await Material.create({
      title,
      description,
      module, // ✅ IMPORTANT
      type: normalizedType,
      fileUrl,
      linkUrl,
      fileType,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      message: "Material uploaded successfully",
      material
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      message: "Failed to upload material",
      error: err.message
    });
  }
};

// ========================================
// 📥 GET MATERIALS BY MODULE
// ========================================
exports.getMaterialsByModule = async (req, res) => {
  try {
    const materials = await Material.find({
      module: req.params.moduleId
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(materials);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch materials",
      error: err.message
    });
  }
};

// ========================================
// ✏️ UPDATE MATERIAL
// ========================================
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description } = req.body;

    if (title) material.title = title;
    if (description) material.description = description;

    if (req.file) {
      material.fileUrl = `/uploads/${req.file.filename}`;
    }

    await material.save();

    res.json({
      message: "Material updated successfully",
      material
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update material",
      error: err.message
    });
  }
};

// ========================================
// ❌ DELETE MATERIAL
// ========================================
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await material.deleteOne();

    res.json({
      message: "Material deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to delete material",
      error: err.message
    });
  }
};