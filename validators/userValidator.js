const { body } = require('express-validator');

const userValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min:8}).withMessage('Password must be at least 8 characters'),


];

module.exports = userValidation;