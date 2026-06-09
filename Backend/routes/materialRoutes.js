const express = require("express");
const router = express.Router();

const {
  uploadMaterial,
  getMaterialsByModule,   // ✅ UPDATED
  updateMaterial,
  deleteMaterial
} = require("../controllers/materialController");

const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");


// ========================================
// 📤 UPLOAD MATERIAL (Teacher/Admin)
// ========================================
router.post(
  "/",
  protect,
  authorize("teacher", "admin"),
  upload.single("file"),
  uploadMaterial
);


// ========================================
// 📥 GET MATERIALS BY MODULE
// ========================================
router.get(
  "/module/:moduleId",   // ✅ UPDATED
  protect,
  getMaterialsByModule   // ✅ UPDATED
);


// ========================================
// ✏️ UPDATE MATERIAL
// ========================================
router.put(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  upload.single("file"),
  updateMaterial
);


// ========================================
// ❌ DELETE MATERIAL
// ========================================
router.delete(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  deleteMaterial
);

module.exports = router;