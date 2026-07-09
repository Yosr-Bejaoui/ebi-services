const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    date_expiration: { type: Date, required: true },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Token', tokenSchema);
