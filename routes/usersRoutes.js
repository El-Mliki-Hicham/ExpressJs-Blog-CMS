var express = require('express');
var router = express.Router();
var {getUsers , storeUser, login} = require('../controllers/userController');
const userValidation = require('../validators/userValidator');
const { loginValidation } = require('../validators/loginValidation');

/* GET users listing. */
router.get('/', function(req, res, next) {  
  res.send('route test');
});

//get users
router.get('/index',getUsers);

//store users
router.post('/store', userValidation, storeUser); 
router.post('/login', loginValidation, login); 


module.exports = router;
