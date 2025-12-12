import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = "secret";
const JWT_SECRET_FROM_ENV = process.env.JWT_SECRET;
if(!JWT_SECRET_FROM_ENV){
    console.log("JWT_SECRET is not set from environment variables");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export const  generateToken = (payload) => {
    if(payload._id){
        const {_id, role, name, ...rest} = payload;
        return jwt.sign({_id,role:role || "admin", name, ...rest}, JWT_SECRET_FROM_ENV || JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    return jwt.sign(payload, JWT_SECRET_FROM_ENV || JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const generateRefreshToken = (payload) => {
    try {
      // If payload has _id (Mongoose document), create a clean payload
      if (payload._id) {
        const { _id, role, name, ...rest } = payload;
        return jwt.sign(
          { 
            id: _id.toString(), 
            role: role, 
            name: name,
            ...rest 
          }, 
          JWT_SECRET, 
          { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );
      }
      
      // If payload is already in the right format, use it as-is
      return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    } catch (error) {
      console.error("Error generating refresh token:", error);
      throw new Error("Failed to generate refresh token");
    }
  };
  
  export const verifyToken = (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new Error("Invalid or expired token");
    }
  };
  
  // Helper to decode token without verification
  export const decodeToken = (token) => {
    return jwt.decode(token);
  };