const Product = require('../models/Product');

const EDITABLE = ['name', 'nameAr', 'description', 'price', 'active', 'colors'];

exports.listPublic = async (req, res) => {
  res.json(await Product.find({ active: true }).sort('order'));
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
  if (!(Number(product.price) >= 0)) return res.status(400).json({ message: 'السعر غير صالح' });
  if (!product.colors.length) return res.status(400).json({ message: 'أضف لوناً واحداً على الأقل' });
  await product.save();
  res.json(product);
};
