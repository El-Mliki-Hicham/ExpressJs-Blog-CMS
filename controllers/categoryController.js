const { validationResult } = require('express-validator'); 
const Category = require('../models/Category');
const { errorResponse , successResponse } = require('../utils/responseHandler');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    successResponse(res, categories, "Categories fetched successfully");
  } catch (err) {
    errorResponse(res, err, "Error fetching categories");
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    console.log(req.params);
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }
    successResponse(res, category, "Category fetched successfully");   
  }
catch (err) {
    errorResponse(res, err, "Error fetching category");
}
}

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "Validation error", 422);
    }
    const category = new Category(req.body);
    await category.save();
    successResponse(res, category, "Category created successfully");
  } catch (err) {
    errorResponse(res, err, "Error creating category");
  }
}

