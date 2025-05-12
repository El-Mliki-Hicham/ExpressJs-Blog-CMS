const Category = require('../models/Category');
const User = require('../models/User');
const {
    body
} = require('express-validator');

const validateArticle = [
    body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({
        min: 3,
        max: 100
    }).withMessage('Title must be between 3 and 100 characters'),

    body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({
        min: 10
    }).withMessage('Content must be at least 10 characters long'),

    body('description')
    .trim()
    .notEmpty().withMessage('Decription is required')
    .isLength({
        min: 10
    }).withMessage('Decription must be at least 10 characters long'),

    body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid MongoDB ID')
    .custom(async (value) => {
        const category = await Category.findById(value);
        if (!category) {
            throw new Error('Category must exist in category collection');
        }
        return true;
    }),

    body("author")
    .trim()
    .notEmpty().withMessage('Author is required')
    .isMongoId().withMessage('Author must be a valid MongoDB ID')
    .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) {
            throw new Error('Author must exist in User collection');
        }
        return true;
    }),

    body('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .isSlug().withMessage('Slug must be a valid URL-friendly string')
    .isLength({
        min: 3,
        max: 100
    }).withMessage('Slug must be between 3 and 100 characters'),

    body('image')
    .optional()
    .custom((value) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(value.mimetype)) {
            throw new Error('File must be a valid image (JPEG, PNG, GIF, or WEBP)');
        }
        return true;
    }),
];

module.exports = validateArticle;