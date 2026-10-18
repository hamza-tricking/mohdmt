const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#f4b6c8' },
  image: { type: String, required: true }, // مسار نسبي مثل /files/xxx.jpg
  available: { type: Boolean, default: true }, // false = مخفي عن الزبون
});

// السعر لا يُخزَّن هنا: أسعار القطع والأزواج في Settings.
const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    colors: [colorSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
