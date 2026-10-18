const User = require('../models/User');
const Product = require('../models/Product');
const seedProducts = require('./seedProducts');

// ينشئ حساب المدير من .env إن لم يوجد (لا يغيّر كلمة مرور حساب موجود).
exports.ensureAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  if (await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })) return;
  await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log('Admin user created');
};

// يضيف المنتجين الأوليين إذا كانت المجموعة فارغة.
exports.ensureProducts = async () => {
  if ((await Product.countDocuments()) > 0) return;
  await Product.insertMany(seedProducts);
  console.log('Seeded products');
};
