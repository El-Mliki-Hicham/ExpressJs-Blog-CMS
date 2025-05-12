const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const { errorResponse, successResponse } = require('../utils/responseHandler');


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

    successResponse(res, user, "Login successful");
  } catch (error) {
    errorResponse(res, error, "Error during login");
  }
}
