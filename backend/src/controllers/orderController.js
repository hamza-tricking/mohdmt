const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const DeliveryRate = require('../models/DeliveryRate');
const Counter = require('../models/Counter');
const WILAYAS = require('../utils/wilayas');
const { calcSubtotal } = require('../utils/pricing');

const PHONE_RE = /^0[567]\d{8}$/;
const STATUSES = Order.schema.path('status').enumValues;
const DELIVERY_TYPES = ['domicile', 'stopdesk'];
const MAX_PIECES = 40;

const badRequest = (res, message) => res.status(400).json({ message });

const nextOrderNumber = async () => {
  const c = await Counter.findOneAndUpdate(
    { name: 'order' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `DMT-${String(c.seq).padStart(5, '0')}`;
};

// كل الأسعار تُحسب هنا من قاعدة البيانات، ولا نثق بأي سعر يرسله المتصفح.
exports.create = async (req, res) => {
  const b = req.body || {};

  // 1) السلة: منتج + لون + كمية، والألوان المخفية لا تُقبل.
  const rawItems = Array.isArray(b.items) ? b.items : [];
  if (rawItems.length === 0 || rawItems.length > 30) return badRequest(res, 'السلة فارغة أو كبيرة جداً');

  const items = [];
  let pieces = 0;
  for (const it of rawItems) {
    const quantity = parseInt(it.quantity, 10);
    if (!(quantity >= 1 && quantity <= 20)) return badRequest(res, 'الكمية غير صالحة');
    const product = await Product.findOne({ _id: it.productId, active: true });
    if (!product) return badRequest(res, 'منتج غير متوفر');
    const color = product.colors.find((c) => c.name === it.color && c.available !== false);
    if (!color) return badRequest(res, `اللون "${it.color}" غير متوفر`);
    items.push({ product: product._id, productName: `${product.nameAr} (${product.name})`, color: color.name, quantity });
    pieces += quantity;
  }
  if (pieces > MAX_PIECES) return badRequest(res, `الحد الأقصى ${MAX_PIECES} قطعة في الطلب الواحد`);

  // 2) بيانات الزبون.
  const phone = String(b.phone || '').replace(/[\s.-]/g, '');
  if (!PHONE_RE.test(phone)) return badRequest(res, 'رقم الهاتف غير صحيح');
  const customerName = String(b.customerName || '').trim();
  const commune = String(b.commune || '').trim();
  const address = String(b.address || '').trim();
  if (customerName.length < 2) return badRequest(res, 'يرجى كتابة الاسم الكامل');
  if (!WILAYAS.includes(b.wilaya)) return badRequest(res, 'الولاية غير صحيحة');
  if (!commune) return badRequest(res, 'يرجى كتابة البلدية');

  // 3) طريقة التوصيل وسعرها من الجدول فقط. إن لم يُحدَّد السعر لا نُكمل.
  if (!DELIVERY_TYPES.includes(b.deliveryType)) return badRequest(res, 'طريقة التوصيل غير صحيحة');
  if (b.deliveryType === 'domicile' && address.length < 5) {
    return badRequest(res, 'يرجى كتابة العنوان للتوصيل إلى المنزل');
  }
  const code = WILAYAS.indexOf(b.wilaya) + 1;
  const rate = await DeliveryRate.findOne({ code });
  const deliveryFee = rate ? rate[b.deliveryType === 'domicile' ? 'home' : 'stopDesk'] : null;
  if (deliveryFee === null || deliveryFee === undefined) {
    return badRequest(res, 'سعر التوصيل لهذه الولاية/الطريقة غير متوفر حالياً');
  }

  // 4) المجموع: الزوج بسعر الزوج والقطعة المتبقية بسعر القطعة.
  const settings = await Settings.findOne({ key: 'main' });
  if (!settings) return res.status(500).json({ message: 'إعدادات الأسعار غير موجودة' });
  const prices = { unitPrice: settings.unitPrice, pairPrice: settings.pairPrice };
  const { pairs, singles, subtotal } = calcSubtotal(pieces, prices);

  const order = await Order.create({
    orderNumber: await nextOrderNumber(),
    items,
    pieces,
    unitPrice: prices.unitPrice,
    pairPrice: prices.pairPrice,
    pairs,
    singles,
    subtotal,
    deliveryType: b.deliveryType,
    deliveryFee,
    total: subtotal + deliveryFee,
    customerName,
    phone,
    wilaya: b.wilaya,
    commune,
    address,
  });

  res.status(201).json({
    id: order._id,
    orderNumber: order.orderNumber,
    pieces,
    subtotal,
    deliveryFee,
    total: order.total,
  });
};

exports.list = async (req, res) => {
  const filter = STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Order.find(filter).sort('-createdAt').limit(500));
};

exports.updateStatus = async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return badRequest(res, 'حالة غير صالحة');
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
  res.json(order);
};
