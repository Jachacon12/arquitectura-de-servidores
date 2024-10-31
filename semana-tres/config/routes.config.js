const express = require('express');
const router = express.Router();
const citationsController = require('../controllers/citations.controller');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/users', usersController.createUser);
router.post('/login', usersController.loginUser);

// Protected routes
router.use(authMiddleware);

router.post('/citations', citationsController.createCitation);
router.get('/citations', citationsController.getAllCitations);
router
  .route('/citations/:id')
  .get(citationsController.getCitationById)
  .patch(citationsController.updateCitation)
  .delete(citationsController.deleteCitation);

module.exports = router;
