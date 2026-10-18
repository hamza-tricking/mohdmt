const express = require('express');
const { rateLimit } = require('express-rate-limit');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const auth = require('../controllers/authController');
const products = require('../controllers/productController');
const orders = require('../controllers/orderController');
const { handleUpload } = require('../controllers/uploadController');

const router = express.Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const limiter = (max) =>
  rateLimit({ windowMs: 15 * 60 * 1000, limit: max, standardHeaders: true, legacyHeaders: false });

router.get('/health', (req, res) => res.json({ ok: true }));

router.post('/auth/login', limiter(20), wrap(auth.login));
router.get('/auth/me', protect, auth.me);

router.get('/products', wrap(products.listPublic));
router.post('/orders', limiter(30), wrap(orders.create));

router.get('/admin/products', protect, wrap(products.listAll));
router.put('/admin/products/:id', protect, wrap(products.update));
router.get('/admin/orders', protect, wrap(orders.list));
router.patch('/admin/orders/:id', protect, wrap(orders.updateStatus));
router.post('/upload', protect, upload.single('file'), handleUpload);

module.exports = router;
