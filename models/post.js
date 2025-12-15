import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "draft"
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
postSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
postSchema.index({ slug: 1 });
postSchema.index({ status: 1 });
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;

