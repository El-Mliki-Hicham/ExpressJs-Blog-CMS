const Article = require('../models/Article');
const User = require('../models/User');
const {
    body
} = require('express-validator');

const commentValidation = [

    body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({
        min: 10
    }).withMessage('Content must be at least 10 characters long'),

   
    body('article')
    .trim()
    .notEmpty().withMessage('Article is required')
    .isMongoId().withMessage('Article must be a valid MongoDB ID')
    .custom(async (value) => {
        const article = await Article.findById(value);
        if (!article) {
            throw new Error('Article must exist in article collection');
        }
        return true;
    }),

    body("user")
    .trim()
    .notEmpty().withMessage('User is required')
    .isMongoId().withMessage('User must be a valid MongoDB ID')
    .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) {
            throw new Error('User must exist in User collection');
        }
        return true;
    }),

   
];

module.exports = commentValidation;