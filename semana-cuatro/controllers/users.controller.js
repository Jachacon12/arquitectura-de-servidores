const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

// Mock function to simulate email sending
const mockSendEmail = (to, subject, content) => {
  console.log('Simulating email send:');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${content}`);
  return Promise.resolve({ response: 'Email sent successfully (simulated)' });
};

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
    user.active = false;
    user.verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const verificationUrl = `http://${req.headers.host}/api/users/verify/${user.verificationToken}`;

    const emailResult = await mockSendEmail(
      user.email,
      'Account Verification',
      `Please click this link to verify your account: ${verificationUrl}`
    );

    console.log(emailResult.response);

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        message: 'User created. Please check your email to verify your account.',
        verificationLink: verificationUrl,
      });
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
    if (!user.active) {
      return res.status(403).json({ message: 'Account not active. Please check your email to verify your account.' });
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

/**
 * Verifies a user's account by validating the verification token.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters containing the verification token.
 * @param {string} req.params.token - The verification token sent to the user's email.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with a success message or an error message.
 */
exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.active = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Account verified successfully. You can now log in.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
