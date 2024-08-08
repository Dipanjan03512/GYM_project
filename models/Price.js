const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: false
  }
});

const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;
