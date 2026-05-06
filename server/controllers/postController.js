import Post from '../models/Post.js';

/* =========================
   CREATE POST
========================= */
export const createPost = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const post = await Post.create({
      title,
      content,
      category,
      status,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};


/* =========================
   GET POSTS (PAGINATION)
========================= */
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: req.user._id });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};


/* =========================
   GET POST BY ID
========================= */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this post'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};


/* =========================
   UPDATE POST
========================= */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { title, content, category, status } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.category = category ?? post.category;
    post.status = status ?? post.status;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};


/* =========================
   DELETE POST
========================= */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};