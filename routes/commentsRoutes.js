const express = require('express');
const router = express.Router();
const { createComment, getCommentById, getAllComments, deleteComment, getCommentsByArticleId } = require('../controllers/commentConroller');
const commentValidation = require('../validators/commentValidation');
const authenticate = require('../middlewares/AuthMiddlewares');
const authorizeRoles = require('../middlewares/RolesMiddlewares');

// Get all comments
router.get("/", authenticate,authorizeRoles('admin'), getAllComments );

router.get("/getCommentsByArticleId",getCommentsByArticleId );
// Get comment by id
router.get("/:id",  authenticate,authorizeRoles('admin'), getCommentById);


// Create a new comment
router.post('/store', authenticate,authorizeRoles('client',"admin"), commentValidation, createComment);

// Delete comment
router.delete('/delete/:id' ,  authenticate,authorizeRoles('admin'), deleteComment);

module.exports = router;