//Require all routes
const express = require('express');
const router = express.Router();

const userController = require('./user')();


router.get('/',function(req, res){
	//res.send("HOME..");
	res.render('index');
});

//user
router.post('/registration',userController.registration);
router.post('/login',userController.login);

//export router
module.exports = router;
