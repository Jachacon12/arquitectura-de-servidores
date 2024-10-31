/**
 * Middleware function for JWT authentication.
 * Verifies the presence and validity of a JWT token in the request header.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls next() if authentication is successful, otherwise sends a 401 response.
 */
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); // Add this line

  if (!authHeader) {
    return res.status(401).json({ message: 'No Authorization header, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token); // Add this line
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('Decoded Token:', decoded); // Add this line
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
