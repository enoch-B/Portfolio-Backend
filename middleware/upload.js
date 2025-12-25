import multer from "multer";
import { profilePictureStorage } from "../config/cloudinary.js";
import { blogPostStorage } from "../config/cloudinary.js";

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }
};

export const uploadConfigs = {
  profilePictureUpload: multer({
    storage: profilePictureStorage,
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter
  }),

  blogPostUpload: multer({
    storage: blogPostStorage,
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter
  })
};




export const uploadProfilePicture =
  uploadConfigs.profilePictureUpload.single("profilePicture");
export const uploadBlogPost = uploadConfigs.blogPostUpload.single("blogPost");

export default uploadConfigs;
