import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  approved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
commentSchema.index({ post: 1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

