const path = require("path");

const express = require("express");

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.indexPage);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct);
router.get('/cart', shopController.cartPage);
router.get('/checkout', shopController.checkoutPage);


router.put('/cart', shopController.cartEditPage);
router.put('/checkout', shopController.checkoutEditPage);

module.exports = router;
