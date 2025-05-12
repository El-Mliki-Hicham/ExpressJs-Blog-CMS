var express = require('express');
var router = express.Router();
var {getUsers , storeUser, login} = require('../controllers/userController');
const userValidation = require('../validators/userValidator');
const { loginValidation } = require('../validators/loginValidation');


//get users
router.get('/',getUsers);

//store users
router.post('/store', userValidation, storeUser); 
router.post('/login', loginValidation, login); 


module.exports = router;
