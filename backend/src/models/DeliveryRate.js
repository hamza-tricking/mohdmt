const mongoose = require('mongoose');

// سعر التوصيل لكل ولاية. null = السعر غير محدد بعد (لا يُخمَّن أبداً).
const deliveryRateSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true, min: 1, max: 58 },
  name: { type: String, required: true },
  home: { type: Number, default: null, min: 0 }, // التوصيل إلى المنزل domicile
  stopDesk: { type: Number, default: null, min: 0 }, // مكتب الاستلام Stop Desk
});

module.exports = mongoose.model('DeliveryRate', deliveryRateSchema);
