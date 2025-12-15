import express from "express";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} from "../controllers/postController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/slug/:slug", getPostBySlug);

// Protected routes (require authentication)
router.get("/:id", authenticate, getPostById);
router.post("/", authenticate, requireAdmin, createPost);
router.put("/:id", authenticate, requireAdmin, updatePost);
router.delete("/:id", authenticate, requireAdmin, deletePost);

export default router;

