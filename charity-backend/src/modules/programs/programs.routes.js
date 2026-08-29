const express = require("express");
const requireAdmin = require("../../gateway/middlewares/authGuard");
const controller = require("./programs.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", requireAdmin, controller.create);
router.put("/:id", requireAdmin, controller.update);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;