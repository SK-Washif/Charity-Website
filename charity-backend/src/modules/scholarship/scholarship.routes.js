const express = require("express");
const { scholarshipLimiter } = require("../../gateway/middlewares/rateLimiter");
const controller = require("./scholarship.controller");

const router = express.Router();

//Submit scholarship
router.post("/", scholarshipLimiter, controller.submit);

//Test Google Sheets connection
router.get("/test-connection", controller.testConnection);

module.exports = router;