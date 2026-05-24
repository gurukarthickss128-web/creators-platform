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

const postRoutes = (io) => {

  /* =========================
     CREATE POST
  ========================= */
  router.post('/', protect, (req, res) => createPost(req, res, io));

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

  return router;
};

export default postRoutes;