const express = require('express');
const router = express.Router();
const Citation = require('../models/citation.model');
const mongoose = require('mongoose');

/**
 * @route POST /api/citations
 * @description Create a new citation
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const newCitation = new Citation(req.body);
    const savedCitation = await newCitation.save();
    res.status(201).json(savedCitation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route GET /api/citations
 * @description Get all citations
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const citations = await Citation.find();
    res.json(citations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/citations/:id
 * @description Get a specific citation by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid citation ID' });
    }

    const citation = await Citation.findById(id);

    if (citation) {
      res.status(200).json(citation);
    } else {
      res.status(404).json({ message: 'Citation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route PATCH /api/citations/:id
 * @description Update a specific citation by ID
 * @access Public
 */
router.patch('/:id', async (req, res) => {
  try {
    const citation = await Citation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!citation) {
      return res.status(404).json({ message: 'Citation not found' });
    }
    res.status(200).json(citation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route DELETE /api/citations/:id
 * @description Delete a specific citation by ID
 * @access Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await Citation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Citation not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
