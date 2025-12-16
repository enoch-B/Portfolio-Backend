import Post from "../models/post.js";

// Get all posts (with filters)
export const getAllPosts = async (req, res) => {
  try {
    const { status, tag, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (tag && tag !== "all") {
      query.tags = { $in: [new RegExp(tag, "i")] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-content"); // Exclude content for list view
    
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      posts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id).populate("author", "name email");
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message
    });
  }
};

// Get single post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await Post.findOne({ slug }).populate("author", "name email profilePicture");
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message
    });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {

    console.log("Received post",req.user.profilePicture)
    const { title, slug, excerpt, content, coverImage, tags, status } = req.body;
    const authorId = req.user.id;
    const authorName= req.user.name;
  

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    // Generate slug if not provided
    let postSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure slug is unique
    const existingPost = await Post.findOne({ slug: postSlug });
    if (existingPost) {
      postSlug = `${postSlug}-${Date.now()}`;
    }

    // Get author info
    const author = await User.findById(authorId).select("name profilePicture");
    
    const post = new Post({
      title,
      slug: postSlug,
      excerpt: excerpt || content.substring(0, 150) + "...",
      content,
      coverImage: coverImage || "",
      tags: Array.isArray(tags) ? tags : [],
      status: status || "draft",
      author: authorId,
      publishedAt: status === "published" ? new Date() : null,
      authorName: authorName || author?.name || req.user?.name || "Admin",
      authorPhoto: author?.profilePicture || req.user?.profilePicture || {
        url: "",
        publicId: ""
      }
    });

    await post.save();
    await post.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post
    });
  } catch (error) {
    console.log("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, coverImage, tags, status } = req.body;

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this post"
      });
    }

    // Update fields
    if (title) post.title = title;
    if (slug) post.slug = slug;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (Array.isArray(tags)) post.tags = tags;
    if (status) {
      post.status = status;
      if (status === "published" && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    post.updatedAt = new Date();
    await post.save();
    await post.populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this post"
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message
    });
  }
};

