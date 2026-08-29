const express = require("express");
const requireAdmin = require("../../gateway/middlewares/authGuard");
const { settingHandlers, listHandlers } = require("./content.controller");

const router = express.Router();

/* ---- singleton settings ---- */
const about = settingHandlers("about");
router.get("/about", about.get);
router.put("/about", requireAdmin, about.put);

const stats = settingHandlers("stats");
router.get("/stats", stats.get);
router.put("/stats", requireAdmin, stats.put);

const scholarshipPreview = settingHandlers("scholarshipPreview");
router.get("/scholarship-preview", scholarshipPreview.get);
router.put("/scholarship-preview", requireAdmin, scholarshipPreview.put);

const donationSettings = settingHandlers("donationSettings");
router.get("/donation-settings", donationSettings.get);
router.put("/donation-settings", requireAdmin, donationSettings.put);

/* ---- list collections ---- */
const banners = listHandlers("banners");
router.get("/banners", banners.getAll);
router.post("/banners", requireAdmin, banners.create);
router.put("/banners/:id", requireAdmin, banners.update);
router.delete("/banners/:id", requireAdmin, banners.remove);

const contactCards = listHandlers("contactCards");
router.get("/contact-cards", contactCards.getAll);
router.post("/contact-cards", requireAdmin, contactCards.create);
router.put("/contact-cards/:id", requireAdmin, contactCards.update);
router.delete("/contact-cards/:id", requireAdmin, contactCards.remove);

const socialLinks = listHandlers("socialLinks");
router.get("/social-links", socialLinks.getAll);
router.post("/social-links", requireAdmin, socialLinks.create);
router.put("/social-links/:id", requireAdmin, socialLinks.update);
router.delete("/social-links/:id", requireAdmin, socialLinks.remove);

const donationMethods = listHandlers("donationMethods");
router.get("/donation-methods", donationMethods.getAll);
router.post("/donation-methods", requireAdmin, donationMethods.create);
router.put("/donation-methods/:id", requireAdmin, donationMethods.update);
router.delete("/donation-methods/:id", requireAdmin, donationMethods.remove);

// ✅ Bank Items - নতুন যোগ করুন
const bankItems = listHandlers("bankItems");
router.get("/bank-items", bankItems.getAll);
router.post("/bank-items", requireAdmin, bankItems.create);
router.put("/bank-items/:id", requireAdmin, bankItems.update);
router.delete("/bank-items/:id", requireAdmin, bankItems.remove);

module.exports = router;