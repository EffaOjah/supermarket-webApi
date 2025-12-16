const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.renderPaymentList);
router.get('/receive', paymentController.renderReceivePayment);
router.post('/receive', paymentController.receivePayment);

module.exports = router;
