const Product = require('../models/Product');

const EDITABLE = ['name', 'nameAr', 'description', 'active', 'colors'];

// الزبون يرى الألوان المتوفرة فقط.
const forPublic = (p) => {
  const obj = p.toObject();
  obj.colors = obj.colors.filter((c) => c.available !== false);
  return obj;
};

exports.listPublic = async (req, res) => {
  const products = await Product.find({ active: true }).sort('order');
  res.json(products.map(forPublic).filter((p) => p.colors.length > 0));
};

exports.listAll = async (req, res) => {
  res.json(await Product.find().sort('order'));
};

exports.update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
  for (const key of EDITABLE) {
    if (req.body[key] !== undefined) product[key] = req.body[key];
  }
  if (!product.colors.length) return res.status(400).json({ message: 'أضف لوناً واحداً على الأقل' });
  await product.save();
  res.json(product);
};
