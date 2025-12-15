import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import {CloudinaryStorage} from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const createStorage = (folder) => {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `portfolio/${folder}`,
        resource_type: 'auto',
        format: async (req, file) => {
          const formatMapping = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
          };
          return formatMapping[file.mimetype] || 'jpg';
        }
      }
    });
  };

  export const profilePictureStorage = createStorage('profile-pictures');
