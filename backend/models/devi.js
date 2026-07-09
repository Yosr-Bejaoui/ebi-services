const mongoose = require('mongoose');

const devisSchema = new mongoose.Schema(
  {
    demande: { type: mongoose.Schema.Types.ObjectId, ref: 'DemandeDevis', required: true },
    fichier_pdf: { type: String, required: true }, 
    montant: { type: Number, required: true },
    statut: {
      type: String,
      enum: ['envoye', 'telecharge', 'archive'],
      default: 'envoye',
    },
    date_telechargement: { type: Date }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Devis', devisSchema);