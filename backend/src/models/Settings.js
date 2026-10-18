const mongoose = require('mongoose');

// وثيقة واحدة فقط (key = 'main') تحفظ أسعار المتجر ورقم واتساب.
const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  unitPrice: { type: Number, required: true, min: 0 }, // سعر القطعة الواحدة (د.ج)
  pairPrice: { type: Number, required: true, min: 0 }, // سعر أي قطعتين معاً (د.ج)
  whatsappNumber: { type: String, default: '' }, // بصيغة دولية بدون +، مثل 213550123456
});

module.exports = mongoose.model('Settings', settingsSchema);
