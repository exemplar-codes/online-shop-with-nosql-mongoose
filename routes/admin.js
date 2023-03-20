const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin')

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => GET
router.get('/edit-product/:productId', adminController.getEditProduct);

// admin/products => GET list of products added by admin
router.get('/products', adminController.getAdminProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product => PUT
router.put('/edit-product', adminController.postAddProduct);

// /admin/add-product => POST
router.post('/delete-all-products', adminController.deleteAllProducts);

module.exports = router;
