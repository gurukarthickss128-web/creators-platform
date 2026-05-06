import express from 'express';
import { protect } from '../middleware/auth.js';

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/postController.js';

const router = express.Router();

/* =========================
   CREATE POST
========================= */
router.post('/', protect, createPost);

/* =========================
   GET POSTS (PAGINATION)
========================= */
router.get('/', protect, getPosts);

/* =========================
   GET SINGLE POST
========================= */
router.get('/:id', protect, getPostById);

/* =========================
   UPDATE POST
========================= */
router.put('/:id', protect, updatePost);

/* =========================
   DELETE POST
========================= */
router.delete('/:id', protect, deletePost);

export default router;