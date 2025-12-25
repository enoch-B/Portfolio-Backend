import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    media:{
        url:String,
        publicId:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
