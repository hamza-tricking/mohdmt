const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: { type: [itemSchema], validate: (v) => v.length > 0 },
    pieces: { type: Number, required: true },
    unitPrice: { type: Number, required: true }, // السعر وقت الطلب
    pairPrice: { type: Number, required: true },
    pairs: { type: Number, required: true },
    singles: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    deliveryType: { type: String, enum: ['domicile', 'stopdesk'], required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    customerName: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true },
    wilaya: { type: String, required: true, trim: true },
    commune: { type: String, required: true, trim: true, maxlength: 80 },
    address: { type: String, default: '', trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
