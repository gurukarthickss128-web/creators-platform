const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

// 🔴 Handle Mongoose invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

// 🔴 Handle duplicate key error (MongoDB unique fields)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

// 🔴 Default status code
  const statusCode = err.statusCode || 500;

// 🔴 Clean response (frontend-friendly for toast)
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;