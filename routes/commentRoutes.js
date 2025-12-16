import express from "express";
import {
  getComments,
  createComment,
  getAllComments,
  updateCommentStatus,
  deleteComment
} from "../controllers/commentController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/post/:postId", getComments);
router.post("/post/:postId", createComment);

// Protected admin routes
router.get("/", authenticate, requireAdmin, getAllComments);
router.put("/:id/status", authenticate, requireAdmin, updateCommentStatus);
router.delete("/:id", authenticate, requireAdmin, deleteComment);

export default router;

