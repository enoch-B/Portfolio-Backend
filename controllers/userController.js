import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const register= async (req, res) =>{
    try{
        console.log("Registering user", req.body);

        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "Name, email and password are required"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const newUser = new User({name, email, password});
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