import User from "../models/user.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const register= async (req, res) =>{
    try{
        console.log("Registering user", req.body);

        const {name, email, password, username} = req.body;
        if(!name || !email || !password || !username){
            return res.status(400).json({message: "Name, email and password are required"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const newUser = new User({name, email, password, username});
        await newUser.save();

        const {password: _, ...userData} = newUser.toObject();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const editUser = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, username} = req.body;

        const user = await User.findByIdAndUpdate(id, {name}, {new: true});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const {password: _, ...userData} = user.toObject();
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: userData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//upload profile picture
export const uploadProfilePictureController = async (req, res) => {
    try {
      // Auth middleware must set req.user
      const userId = req.user.id;
  
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded"
        });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Delete old image from Cloudinary (optional but recommended)
      if (user.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
      }
  
      // Save new image
      user.profilePicture = {
        url: req.file.path,       // Cloudinary secure URL
        publicId: req.file.filename // Cloudinary public_id
      };
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        profilePicture: user.profilePicture.url
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };

  //get profile picture
  export const getProfilePicture = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id).select("profilePicture");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      res.status(200).json({
        success: true,
        profilePicture: user.profilePicture?.url || null
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    
    const userId = req.user.id;
    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      },
      name: user.name,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name) user.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use"
        });
      }
      user.email = email;
    }

    await user.save();
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message
    });
  }
};
  