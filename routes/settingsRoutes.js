import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route to get settings
router.get("/",authenticate, getSettings);

// Protected routes (require admin)
router.put("/", authenticate, requireAdmin, updateSettings);

export default router;

