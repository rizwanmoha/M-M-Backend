const express = require("express");
const router = express.Router();

const {registerController , loginController , googleController , forgotPassword} = require('../controllers/AuthController');

router.post('/register' , registerController);

router.post('/login' , loginController)

router.post('/google' , googleController);

router.post('/forgot' , forgotPassword);


module.exports = router;
