const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.indexPage);
router.get("/products", shopController.getProducts);
// router.get("/products/:productId", shopController.getProduct);
// router.get("/cart", shopController.cartPage);
// router.get("/checkout", shopController.checkoutPage);
// router.get("/orders", shopController.ordersPage);
// router.get("/orders/:orderId", shopController.orderPage);

// router.post("/cart", shopController.postCart);
// router.post("/orders", shopController.createOrder);
// router.put("/checkout", shopController.checkoutEditPage);

module.exports = router;
