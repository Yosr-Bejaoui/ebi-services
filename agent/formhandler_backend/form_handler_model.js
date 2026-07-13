const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis"],
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
  },
  phone: {
    type: String,
    required: [true, "Le numéro de téléphone est requis"],
  },
  message: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const FormResponse = mongoose.model("FormResponse", formResponseSchema);
module.exports = FormResponse;
