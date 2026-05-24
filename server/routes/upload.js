import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * Upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "creator-platform" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/**
 * POST /api/upload
 * Protected route
 */
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * Multer error handler
 */
router.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File is too large. Maximum size is 5MB.",
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || "File upload error",
  });
});

export default router;