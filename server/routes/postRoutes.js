import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPost, getPosts } from '../controllers/postController.js';

const router = express.Router();

// CREATE POST
router.post('/', protect, createPost);

// GET POSTS (with pagination)
router.get('/', protect, getPosts);

export default router;