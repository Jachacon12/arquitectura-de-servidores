/**
 * Middleware function for authentication using JWT.
 * Verifies the presence and validity of a JWT in the request headers.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 * @throws {Object} Returns a 401 status with an error message if authentication fails.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
