const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Creates a new user in the database and returns a JWT token.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with token or error message.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Authenticates a user and generates a JWT token upon successful login.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {string} req.body.email - The email of the user attempting to login.
 * @param {string} req.body.password - The password of the user attempting to login.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with access token or error message.
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ accessToken: token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
