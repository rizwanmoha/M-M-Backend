const express = require("express");
const { PaymentController } = require("../controllers/PaymentController");
const router = express.Router();

// const {registerController , loginController} = require('../controllers/AuthController');

router.post('/create-order' , PaymentController);


module.exports = router;
