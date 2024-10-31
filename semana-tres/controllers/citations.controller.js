const Citation = require('../models/citation.model');

/**
 * Creates a new citation in the database.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} req.body - The citation data to be saved.
 * @param {Object} res - The response object from Express.
 * @returns {Object} - The saved citation object as JSON with a 201 status code on success,
 *                     or an error message with a 400 status code on failure.
 */
exports.createCitation = async (req, res, next) => {
  try {
    const { text, author } = req.body;
    const userId = req.user.userId;

    const citation = await Citation.create({
      text,
      author,
      user: userId,
    });

    res.status(201).json(citation);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all citations from the database.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @returns {Object} - JSON response containing an array of all citations on success,
 *                     or an error message with a 500 status code on failure.
 */

exports.getAllCitations = async (req, res) => {
  try {
    const citations = await Citation.find();
    res.json(citations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a single citation from the database by its ID.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} req.params - The parameters parsed from the URL.
 * @param {string} req.params.id - The ID of the citation to retrieve.
 * @param {Object} res - The response object from Express.
 * @returns {Object} - JSON response containing the citation if found,
 *                     or a 404 error message if not found,
 *                     or a 500 error message if an internal server error occurs.
 */
/**
 * Retrieves a single citation from the database by its ID.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} req.params - The parameters parsed from the URL.
 * @param {string} req.params.id - The ID of the citation to retrieve.
 * @param {Object} res - The response object from Express.
 * @returns {Object} - JSON response containing the citation if found,
 *                     or a 404 error message if not found,
 *                     or a 500 error message if an internal server error occurs.
 */
exports.getCitationById = async (req, res) => {
  try {
    const citation = await Citation.findById(req.params.id);
    if (citation) {
      res.json(citation);
    } else {
      res.status(404).json({ message: 'Citation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a citation in the database by its ID.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} req.params - The parameters parsed from the URL.
 * @param {string} req.params.id - The ID of the citation to update.
 * @param {Object} req.body - The updated citation data.
 * @param {Object} res - The response object from Express.
 * @returns {Object} - JSON response containing the updated citation if found and updated,
 *                     or a 404 error message if not found,
 *                     or a 400 error message if the update fails.
 */
exports.updateCitation = async (req, res) => {
  try {
    const citation = await Citation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!citation) {
      return res.status(404).json({ message: 'Citation not found' });
    }
    res.status(200).json(citation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Deletes a citation from the database by its ID.
 *
 * @param {Object} req - The request object from Express.
 * @param {Object} req.params - The parameters parsed from the URL.
 * @param {string} req.params.id - The ID of the citation to delete.
 * @param {Object} res - The response object from Express.
 * @returns {Object} - Empty response with a 204 status code if the citation is successfully deleted,
 *                     or a 404 error message if the citation is not found,
 *                     or a 500 error message if an internal server error occurs.
 */
exports.deleteCitation = async (req, res) => {
  try {
    const result = await Citation.findByIdAndDelete(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Citation not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
