const express = require('express');
const router = express.Router();
const articleValidation = require('../validators/articleValidation');
const { getAllArticles, getArticleById, createArticle, removeArticle, blockArticle, acceptArticle } = require('../controllers/articleContoller');
const authorizeRoles = require('../middlewares/RolesMiddlewares');
const authenticate = require('../middlewares/AuthMiddlewares');


// Get all categories
router.get("/", getAllArticles);

// Get category by id
router.get("/:id", getArticleById);

// Create a new category
router.post('/store', authenticate, articleValidation, createArticle);

// Delete Article
router.delete("/delete/:id",  authenticate,authorizeRoles('admin',"client"), removeArticle);

// Accept article
router.post("/acceptArticle/:id",authenticate,authorizeRoles('admin'), acceptArticle);

// Block article
router.post("/blockArticle/:id",authenticate,authorizeRoles('admin') , blockArticle);


module.exports = router;