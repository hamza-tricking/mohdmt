const Settings = require('../models/Settings');
const DeliveryRate = require('../models/DeliveryRate');

const WHATSAPP_RE = /^\d{8,15}$/;
const isPrice = (v) => v === null || v === '' || (Number.isFinite(Number(v)) && Number(v) >= 0);
const toPrice = (v) => (v === null || v === '' ? null : Number(v));

// عام: الأسعار ورقم واتساب يحتاجهما الموقع.
exports.getPublic = async (req, res) => {
  const s = await Settings.findOne({ key: 'main' });
  res.json({
    unitPrice: s.unitPrice,
    pairPrice: s.pairPrice,
    whatsappNumber: s.whatsappNumber,
  });
};

exports.getAdmin = exports.getPublic;

exports.update = async (req, res) => {
  const b = req.body || {};
  if (!isPrice(b.unitPrice) || b.unitPrice === null || b.unitPrice === '') {
    return res.status(400).json({ message: 'سعر القطعة غير صالح' });
  }
  if (!isPrice(b.pairPrice) || b.pairPrice === null || b.pairPrice === '') {
    return res.status(400).json({ message: 'سعر الزوج غير صالح' });
  }
  const whatsapp = String(b.whatsappNumber || '').replace(/[\s+]/g, '');
  if (whatsapp && !WHATSAPP_RE.test(whatsapp)) {
    return res.status(400).json({ message: 'رقم واتساب غير صالح (أرقام فقط مع رمز الدولة، مثل 213550123456)' });
  }
  const s = await Settings.findOneAndUpdate(
    { key: 'main' },
    { unitPrice: Number(b.unitPrice), pairPrice: Number(b.pairPrice), whatsappNumber: whatsapp },
    { new: true, upsert: true }
  );
  res.json({ unitPrice: s.unitPrice, pairPrice: s.pairPrice, whatsappNumber: s.whatsappNumber });
};

// أسعار التوصيل: عام للقراءة، ومحمي للتعديل.
exports.listRates = async (req, res) => {
  const rates = await DeliveryRate.find().sort('code');
  res.json(rates.map((r) => ({ code: r.code, name: r.name, home: r.home, stopDesk: r.stopDesk })));
};

exports.updateRates = async (req, res) => {
  const list = Array.isArray(req.body.rates) ? req.body.rates : null;
  if (!list || list.length === 0) return res.status(400).json({ message: 'لا توجد بيانات للحفظ' });

  const ops = [];
  for (const r of list) {
    const code = parseInt(r.code, 10);
    if (!(code >= 1 && code <= 58)) return res.status(400).json({ message: 'رمز ولاية غير صالح' });
    if (!isPrice(r.home) || !isPrice(r.stopDesk)) {
      return res.status(400).json({ message: `سعر غير صالح للولاية ${code}` });
    }
    ops.push({
      updateOne: {
        filter: { code },
        update: { $set: { home: toPrice(r.home), stopDesk: toPrice(r.stopDesk) } },
      },
    });
  }
  await DeliveryRate.bulkWrite(ops);
  res.json({ updated: ops.length });
};
