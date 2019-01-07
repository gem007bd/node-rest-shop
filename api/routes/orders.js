const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orders');

// Handling incoming GET requests to /orders
router.get('/', OrderController.orders_get_all);

// Handling POST request for /orders
router.post('/', checkAuth, OrderController.orders_create_order);

// Handling incoming GET request depends on orderid
router.get('/:orderId', checkAuth, OrderController.orders_get_order);

// Handling POST request to delete orders
router.delete('/:orderId', checkAuth, OrderController.orders_delete_order);

module.exports = router;