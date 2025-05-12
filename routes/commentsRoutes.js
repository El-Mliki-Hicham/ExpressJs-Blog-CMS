const express = require('express');
const router = express.Router();
const { createComment, getCommentById, getAllComments, deleteComment } = require('../controllers/commentConroller');
const commentValidation = require('../validators/commentValidation');

// Get all comments
router.get("/", getAllComments);

// Get comment by id
router.get("/:id", getCommentById);

// Create a new comment
router.post('/store', commentValidation, createComment);

// Delete comment
router.delete('/delete/:id', deleteComment);

module.exports = router;