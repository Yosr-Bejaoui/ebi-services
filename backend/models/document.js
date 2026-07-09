const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    demande: { type: mongoose.Schema.Types.ObjectId, ref: 'DemandeDevis' },

    nom_fichier: { type: String, required: true },
    lien: { type: String, required: true }, // secure storage URL (e.g. S3 signed URL)

    // Who uploaded it — client or EBI Services (admin)
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origine: { type: String, enum: ['client', 'admin'], required: true },

    taille: { type: Number },       // bytes, useful for storage limits
    type_mime: { type: String },    // e.g. 'application/pdf'
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);