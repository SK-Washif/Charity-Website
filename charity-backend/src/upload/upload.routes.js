const express = require("express");
const multer = require("multer");
const requireAdmin = require("../gateway/middlewares/authGuard");
const asyncHandler = require("../utils/asyncHandler");
const { ok, fail } = require("../utils/apiResponse");
const { uploadToImgbb } = require("./imagebb.client");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("শুধু ছবির ফাইল আপলোড করা যাবে।"));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post(
  "/",
  requireAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return fail(res, 400, err.message);
      next();
    });
  },
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return fail(res, 400, "কোনো ছবি পাওয়া যায়নি।");
    }
    const url = await uploadToImgbb(req.file.buffer, req.file.originalname);
    return ok(res, { url });
  })
);

module.exports = router;