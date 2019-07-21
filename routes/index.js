//Require all routes
const express = require('express');
const router = express.Router();
const userController = require('./user')();
const adminController = require('./admin')();

router.get('/', (req, res) => {
  res.render('index');
  //res.render('admin')
});

//user
router.post('/userRegistration', userController.registration);
// router.post('/login',userController.login);

//Admin
router.post('/adminRegistration', adminController.registration);
router.post('/adminLogin',adminController.login);

//export router
module.exports = router;