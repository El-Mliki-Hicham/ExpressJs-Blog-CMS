const express = require('express');
const router = express.Router();
const categoryValidation = require('../validators/categoryValidation');
const { createCategory, getCategories, getCategoryById } = require('../controllers/categoryController');

// Get all categories
router.get("/", getCategories);

// Get category by id
router.get("/:id", getCategoryById);

// Create a new category
router.post('/store', categoryValidation, createCategory);

module.exports = router;