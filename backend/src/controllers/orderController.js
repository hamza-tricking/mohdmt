const Order = require('../models/Order');
const Product = require('../models/Product');
const WILAYAS = require('../utils/wilayas');

const PHONE_RE = /^0[567]\d{8}$/;
const STATUSES = Order.schema.path('status').enumValues;

exports.create = async (req, res) => {
  const b = req.body || {};
  const product = await Product.findOne({ _id: b.productId, active: true });
  if (!product) return res.status(400).json({ message: 'المنتج غير متوفر' });
  const color = product.colors.find((c) => c.name === b.color);
  if (!color) return res.status(400).json({ message: 'اللون غير متوفر' });

  const phone = String(b.phone || '').replace(/[\s.-]/g, '');
  if (!PHONE_RE.test(phone)) return res.status(400).json({ message: 'رقم الهاتف غير صحيح' });
  if (!WILAYAS.includes(b.wilaya)) return res.status(400).json({ message: 'الولاية غير صحيحة' });
  const customerName = String(b.customerName || '').trim();
  const commune = String(b.commune || '').trim();
  if (customerName.length < 2 || !commune) {
    return res.status(400).json({ message: 'يرجى ملء الاسم والبلدية' });
  }
  const quantity = Math.min(20, Math.max(1, parseInt(b.quantity, 10) || 1));

  const order = await Order.create({
    product: product._id,
    productName: `${product.nameAr} (${product.name})`,
    color: color.name,
    quantity,
    unitPrice: product.price,
    total: product.price * quantity,
    customerName,
    phone,
    wilaya: b.wilaya,
    commune,
    address: String(b.address || '').trim(),
  });
  res.status(201).json({ id: order._id, total: order.total });
};

exports.list = async (req, res) => {
  const filter = STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Order.find(filter).sort('-createdAt').limit(500));
};

exports.updateStatus = async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: 'حالة غير صالحة' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
  res.json(order);
};
