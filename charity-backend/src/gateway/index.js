const express = require("express");
const contentRoutes = require("../modules/content/content.routes");
const programsRoutes = require("../modules/programs/programs.routes");
const galleryRoutes = require("../modules/gallery/gallery.routes");
const scholarshipRoutes = require("../modules/scholarship/scholarship.routes");
const uploadRoutes = require("../upload/upload.routes");

const router = express.Router();

// ✅ Public routes
router.get("/health", (req, res) => res.json({ data: { ok: true } }));

// ✅ Routes (auth handled inside each module)
router.use("/content", contentRoutes);
router.use("/programs", programsRoutes);
router.use("/gallery", galleryRoutes);
router.use("/upload", uploadRoutes);
router.use("/scholarship", scholarshipRoutes);

module.exports = router;