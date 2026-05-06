import Post from '../models/Post.js';
import AppError from '../utils/AppError.js';

/* =========================
   CREATE POST
========================= */
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, status } = req.body;

    if (!title || !content) {
      return next(new AppError('Title and content are required', 400));
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

  } catch (err) {
    next(err);
  }
};

/* =========================
   GET POSTS
========================= */
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: req.user._id });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    next(err);
  }
};

/* =========================
   GET POST BY ID
========================= */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author._id.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to view this post', 403));
    }

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE POST
========================= */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to update this post', 403));
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

  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE POST
========================= */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to delete this post', 403));
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });

  } catch (err) {
    next(err);
  }
};