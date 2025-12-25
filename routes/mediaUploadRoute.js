import express from "express";
import { uploadBlogPostMedia, deleteBlogPostMedia, getBlogPostMediaById, getAllBlogPostMedia } from "../controllers/mediaUploadController.js";
import { uploadBlogPost } from "../middleware/upload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/blog-post/media", authenticate, uploadBlogPost, uploadBlogPostMedia);
router.get("/blog-post/media/:id", authenticate, getBlogPostMediaById);
router.get("/blog-post/media",authenticate, getAllBlogPostMedia)
router.delete("/blog-post/media/:id", authenticate, deleteBlogPostMedia);

export default router;