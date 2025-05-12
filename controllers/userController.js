const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const { errorResponse, successResponse } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    successResponse(res, users, "Users fetched successfully");   
  } catch (error) {
   errorResponse(res, error, "Error occurred while fetching users")
  }
};

exports.storeUser = async (req, res) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return errorResponse(res, validationError.array(), "Validation failed", 400);
  }

  try {
    const user = await userService.createUser(req.body);
    successResponse(res, user, "User has been created successfully");
  } catch (error) {
    errorResponse(res, error, "Error in storing user");
  }
};

exports.login = async (req, res) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return errorResponse(res, validationError.array(), "Validation failed", 400);
  }

  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    
    if (!user) {
      return errorResponse(res, null, "Invalid credentials", 401);
    }

    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data with token
    successResponse(res, {
      user,
      token
    }, "Login successful");

  } catch (error) {
    errorResponse(res, error, "Error during login");
  }
}
