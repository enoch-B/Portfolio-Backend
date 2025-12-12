import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";

export const login= async (req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid credentials"});
        }

        //upon successful login,
        user.lastLogin = new Date();
        await user.save();

        const accessToken = generateToken({_id: user._id, role: user.role, name: user.name});
        const refreshToken = generateRefreshToken({_id: user._id, role: user.role, name: user.name});
   
        const {password: _, ...userData} = user.toObject();
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userData,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
    
}

//refresh token

export const refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }
  
      // Verify refresh token
      const decoded = verifyToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
  
      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Generate a new access token
      const accessToken = generateToken({
        _id: user._id,
        role: user.role,
        name: user.name
      });
  
      return res.status(200).json({
        success: true,
        message: "Token refreshed",
        accessToken,   //  MUST match frontend
      });
  
    } catch (error) {
      console.error("Refresh error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  