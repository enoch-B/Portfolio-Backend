import Comment from "../models/comment.js";
import Post from "../models/post.js";

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const comments = await Comment.find({ 
      post: postId
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Name and content are required"
      });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const comment = new Comment({
      post: postId,
      name,
      content,
      approved: true // Auto-approve comments
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      comment
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message
    });
  }
};

// Get all comments (admin only - for moderation)
export const getAllComments = async (req, res) => {
  try {
    const { approved, postId } = req.query;
    
    const query = {};
    if (approved !== undefined) {
      query.approved = approved === "true";
    }
    if (postId) {
      query.post = postId;
    }

    const comments = await Comment.find(query)
      .populate("post", "title slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};

// Approve/Reject comment (admin only)
export const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { approved },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Comment ${approved ? "approved" : "rejected"} successfully`,
      comment
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update comment",
      error: error.message
    });
  }
};

// Delete comment (admin only)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message
    });
  }
};

