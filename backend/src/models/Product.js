const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#f4b6c8' },
  image: { type: String, required: true }, // مسار نسبي مثل /files/xxx.jpg
});

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    colors: [colorSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
