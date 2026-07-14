const errorHandler = (err, req, res, next ) =>{
    let error = { ...err };
    error.message = err.message;
}

// Mongoose dublicate key error
if (err.code === 11000) {
    const field = Object.keys(err.keyPattern) [0];
    const message = `${field} already exists`;
    return res.status(400).json({ message });
}

// mONGOOSE validation error
if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message });
}

// JWT error
if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
}

res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error'
});

module.exports = errorHandler;

