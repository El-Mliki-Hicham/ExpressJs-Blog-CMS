const { validationResult } = require('express-validator');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { errorResponse, successResponse } = require('../utils/responseHandler');

// Get all comments
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('article user');
        successResponse(res, comments, "Comments fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching comments");
    }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('article user');
        if (!comment) {
            return errorResponse(res, null, "Comment not found", 404);
        }
        successResponse(res, comment, "Comment fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching comment");
    }
};

// Create new comment
exports.createComment = async (req, res) => {
    try {
        
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return errorResponse(res, validationErrors.array(), "Validation error", 422);
          }

        const comment = new Comment({
            content: req.body.content,
            article: req.body.article,
            user: req.body.user
        });

        const savedComment = await comment.save();
        await savedComment.populate('article user');
        successResponse(res, savedComment, "Comment created successfully", 201);
    } catch (error) {
        errorResponse(res, error, "Error creating comment");
    }
};


// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return errorResponse(res, null, "Comment not found", 404);
        }

        await Comment.findByIdAndDelete(req.params.id);
        successResponse(res, null, "Comment deleted successfully");
    
    } catch (error) {
        errorResponse(res, error, "Error deleting comment");
    }
};


