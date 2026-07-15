module.exports = function errorHandler(err, req, res, next) {
  console.log('Error occurred:', err.message);

  // Handle duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error'
    });
  }

  // Handle validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};