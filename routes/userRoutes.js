import express from "express";
import { 
  editUser, 
  uploadProfilePictureController, 
  getProfilePicture,
  getAdminProfile,
  updateAdminProfile,
  changePassword
} from "../controllers/userController.js";
import { uploadProfilePicture  } from "../middleware/upload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.put("/update/:id", editUser);
router.post("/upload-profile-picture", authenticate, uploadProfilePicture, uploadProfilePictureController);
router.get("/get-profile-picture/:id", getProfilePicture);

// Admin profile routes
router.get("/admin/profile", authenticate, getAdminProfile);
router.put("/admin/profile", authenticate, updateAdminProfile);
router.post("/admin/change-password", authenticate, changePassword);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Henok Birhanu"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     lastLogin:
 *                       type: string
 *       400:
 *         description: Name and email are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
export default router;