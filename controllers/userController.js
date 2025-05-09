const { validationResult } = require('express-validator');
const userService = require('../services/userService');


exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.storeUser = async (req, res) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: validationError.array(),
    });
  }

  try {
    const user = await userService.createUser(req.body);
    res.status(200).json({
      success: true,
      message: "User has been created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in storing user",
      error: error.message,
    });
  }
};

exports.login = async (req , res)=> {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: validationError.array(),
    });
  }

  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message
    });
  }
}
