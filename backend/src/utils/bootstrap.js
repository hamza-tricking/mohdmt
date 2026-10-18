const User = require('../models/User');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const DeliveryRate = require('../models/DeliveryRate');
const seedProducts = require('./seedProducts');
const WILAYAS = require('./wilayas');

// ينشئ حساب المدير من .env إن لم يوجد (لا يغيّر كلمة مرور حساب موجود).
exports.ensureAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  if (await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })) return;
  await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log('Admin user created');
};

// يضيف المنتجات الأولية إذا كانت المجموعة فارغة.
exports.ensureProducts = async () => {
  if ((await Product.countDocuments()) > 0) return;
  await Product.insertMany(seedProducts);
  console.log('Seeded products');
};

// إعدادات الأسعار: 950 للقطعة و1600 للزوج (تُعدَّل من لوحة التحكم).
exports.ensureSettings = async () => {
  await Settings.updateOne(
    { key: 'main' },
    { $setOnInsert: { key: 'main', unitPrice: 950, pairPrice: 1600, whatsappNumber: '' } },
    { upsert: true }
  );
};

// أسعار التوصيل للولايات الـ58 بدون أسعار (null) حتى تُدخلها من لوحة التحكم.
exports.ensureDeliveryRates = async () => {
  const ops = WILAYAS.map((name, i) => ({
    updateOne: {
      filter: { code: i + 1 },
      update: { $setOnInsert: { code: i + 1, name, home: null, stopDesk: null } },
      upsert: true,
    },
  }));
  await DeliveryRate.bulkWrite(ops);
};
