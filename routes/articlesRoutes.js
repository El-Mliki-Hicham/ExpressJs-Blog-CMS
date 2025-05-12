const express = require('express');
const router = express.Router();
const articleValidation = require('../validators/articleValidation');
const { getAllArticles, getArticleById, createArticle, removeArticle, blockArticle, acceptArticle } = require('../controllers/articleContoller');


// Get all categories
router.get("/", getAllArticles);

// Get category by id
router.get("/:id", getArticleById);

// Create a new category
router.post('/store', articleValidation, createArticle);

// Delete Article
router.delete("/delete/:id", removeArticle);

// Accept article
router.post("/acceptArticle/:id", acceptArticle);

// Block article
router.post("/blockArticle/:id", blockArticle);


module.exports = router;