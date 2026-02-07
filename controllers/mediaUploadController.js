import Media from "../models/media.js"; // Capitalized model name
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// UPLOAD MEDIA
export const uploadBlogPostMedia = async (req, res) => {
    try {
        console.log("REQUEST FROM FRONT END", req.file)
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }

        const newMedia = new Media({
            url: req.file.path,
            publicId: req.file.filename,
            userId: userId,
            name: req.file.originalname,
            size: req.file.size,
            uploadedAt: new Date()
        });

        const savedMedia = await newMedia.save();

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            media: savedMedia
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET ALL MEDIA FOR A USER
export const getAllBlogPostMedia = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching media for userId:", userId);
        const mediaItems = await Media.find({ userId }).sort({ uploadedAt: -1 });
        console.log(`Found ${mediaItems.length} media items`);

        res.status(200).json({
            success: true,
            media: mediaItems || [],
            count: mediaItems.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// GET SINGLE MEDIA BY ID
export const getBlogPostMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const mediaItem = await Media.findById(id);

        if (!mediaItem) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }

        res.status(200).json({
            success: true,
            media: mediaItem
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// DELETE MEDIA
export const deleteBlogPostMedia = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting media with ID:", id);
        const mediaItem = await Media.findById(id);

        if (!mediaItem) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }


        await cloudinary.uploader.destroy(mediaItem.publicId);


        await Media.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "Media deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};