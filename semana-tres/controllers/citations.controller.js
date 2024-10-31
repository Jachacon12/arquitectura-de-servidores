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
exports.createCitation = async (req, res) => {
  try {
    const newCitation = new Citation(req.body);
    const savedCitation = await newCitation.save();
    res.status(201).json(savedCitation);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
