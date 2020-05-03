const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const searchSchema = new Schema({
  url: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  email: { type: String, required: true }
}, {
  timestamps: true,
});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;