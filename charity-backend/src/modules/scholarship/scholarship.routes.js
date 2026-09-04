const express = require("express");
const requireAdmin = require("../../gateway/middlewares/authGuard");
const { scholarshipLimiter } = require("../../gateway/middlewares/rateLimiter");
const controller = require("./scholarship.controller");

const router = express.Router();


router.post("/", scholarshipLimiter, controller.submit);


router.get("/test-connection", requireAdmin, controller.testConnection);

module.exports = router;
