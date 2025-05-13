const { validationResult } = require('express-validator');
const fs = require('fs'); 
const Article = require('../models/Article');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const upload = require('../config/multer');
const Media = require('../models/Media');

// Get all articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author image category')
            .sort({ createdAt: -1 });
        successResponse(res, articles, "Articles fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching categories");
    }
};

// Get single article by ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author image category');
        if (!article) {
            console.log(article);
            
            return errorResponse(res,'fetching error', 'Article not found', 404);
        }
        successResponse(res, article, "Article fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching article");
    }
};



// Create article and store his media
exports.createArticle = async (req, res) => {
    // First handle the file upload
    upload(req, res, async (err) => {
      try {
        // Handle Multer errors
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(res, null, 'File size too large (max 5MB)', 413);
          }
          return errorResponse(res, null, err.message, 400);
        }
  
        // Handle validation errors        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // If there's an uploaded file but validation failed, delete it
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return errorResponse(res, errors.array(), "Validation error", 422);
        }
  
  
        const { title, content, description, slug, author,category} = req.body;
  
        // Create media document for the uploaded image
        if(req.file){

            const media = new Media({
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/storage/articles/${req.file.filename}` // relative path from public folder
            });
            
            const savedMedia = await media.save();
            var image = savedMedia._id;
        }else{
            var image = null;
        }
  
        // Create new article
        const article = new Article({
          title,
          content,
          description,
          author,
          slug,
          category,
          image
        });
        const savedArticle = await article.save();
        await savedArticle.populate('author image category');
  
        return successResponse(res, {
          article: savedArticle
        }, "Article created successfully", 201);
  
    } catch (error) {
        console.error('Article Creation Error:', error);
        
        // Clean up uploaded file if error occurred
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
  
        // Handle duplicate slug error
        if (error.code === 11000) {
          if (error.keyPattern.slug) {
            return errorResponse(res, null, "Slug must be unique", 400);
          }
          if (error.keyPattern['image.url']) {
            return errorResponse(res, null, "Image URL must be unique", 400);
          }
        }
  
        // Handle other Mongoose validation errors
        if (error.name === 'ValidationError') {
          return errorResponse(res, error.errors, "Validation error", 400);
        }
  
        // Generic error response
        return errorResponse(res, error, "Error storing article");
      }
    });
  };


exports.removeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author image category');
        
        if (!article) {
            return errorResponse(res, null, 'Article not found', 404);
        }

        // Delete associated media file if exists
        if (article.image) {
            const media = await Media.findById(article.image);
            if (media) {
                const filePath = `./public${media.url}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                await Media.findByIdAndDelete(article.image);
            }
        }

        // Delete the article
        await Article.findByIdAndDelete(req.params.id);
        
        successResponse(res, null, "Article deleted successfully");
    } catch (error) {
        errorResponse(res, error, "Error deleting article");
    }
};

exports.acceptArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author image category');

    if (!article) {
      return errorResponse(res, null, 'Article not found', 404);
    }
    article.status = "accepted";
    article.publish = true;
    await article.save();

    return successResponse(res, article, "Article accepted successfully");

  } catch (error) {
    return errorResponse(res, error, "Error accepting article");
  }
};
exports.blockArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return errorResponse(res, null, 'Article not found', 404);
    }
    article.status = "blocked";
    article.publish = false;
    await article.save();

    return successResponse(res, article, "Article blocked successfully");

  } catch (error) {
    return errorResponse(res, error, "Error accepting article");
  }
};


exports.updateArticle = async (req, res) => {
    // First handle the file upload
    upload(req, res, async (err) => {
        try {
            // Handle Multer errors
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return errorResponse(res, null, 'File size too large (max 5MB)', 413);
                }
                return errorResponse(res, null, err.message, 400);
            }

            const article = await Article.findById(req.params.id).populate('author image category');
            if (!article) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return errorResponse(res, null, 'Article not found', 404);
            }

            // Handle validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return errorResponse(res, errors.array(), "Validation error", 422);
            }

            // Handle new image upload
            if (req.file) {
                // Delete old image if exists
                if (article.image) {
                    const oldMedia = await Media.findById(article.image);
                    if (oldMedia) {
                        const oldFilePath = `./public${oldMedia.url}`;
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                        await Media.findByIdAndDelete(article.image);
                    }
                }

                // Create new media document
                const media = new Media({
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    url: `/storage/articles/${req.file.filename}`
                });
                const savedMedia = await media.save();
                article.image = savedMedia._id;
            }

            // Update article fields
            const { title, content, description, slug, category } = req.body;
            
            article.title = title || article.title;
            article.content = content || article.content;
            article.description = description || article.description;
            article.slug = slug || article.slug;
            article.category = category || article.category;

            const updatedArticle = await article.save();
            await updatedArticle.populate('author image category');

            return successResponse(res, updatedArticle, "Article updated successfully");

        } catch (error) {
            // Clean up uploaded file if error occurred
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            // Handle duplicate slug error
            if (error.code === 11000) {
                if (error.keyPattern.slug) {
                    return errorResponse(res, null, "Slug must be unique", 400);
                }
                if (error.keyPattern['image.url']) {
                    return errorResponse(res, null, "Image URL must be unique", 400);
                }
            }

            // Handle validation errors
            if (error.name === 'ValidationError') {
                return errorResponse(res, error.errors, "Validation error", 400);
            }

            return errorResponse(res, error, "Error updating article");
        }
    });
};
