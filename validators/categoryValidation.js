const { body } = require('express-validator');
const Category = require('../models/Category'); // Adjust path as needed
 

const categoryValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .custom(async (value) => {
            const existingCategory = await Category.findOne({ name: value });
            if (existingCategory) {
                throw new Error('Category name already exists');
            }
            return true;
        }),
    body('description').notEmpty().withMessage('Name is required').trim()
];

module.exports = categoryValidation;