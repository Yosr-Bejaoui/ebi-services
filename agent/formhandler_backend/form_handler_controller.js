const FormResponse = require("./form_handler_model");

exports.createFormResponse = async (req, res) => {
  try {
    const formResponse = new FormResponse(req.body);
    const saved = await formResponse.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating form response:", error);
    res.status(500).json({ error: "Erreur lors de la création de la réponse." });
  }
};

exports.deleteFormResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FormResponse.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Réponse non trouvée." });
    }
    res.status(200).json({ message: "Réponse supprimée avec succès." });
  } catch (error) {
    console.error("Error deleting form response:", error);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
};

exports.getFormResponsesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const formResponses = await FormResponse.find({ user_id });
    res.status(200).json(formResponses);
  } catch (error) {
    console.error("Error retrieving form responses:", error);
    res.status(500).json({ error: "Erreur lors de la récupération." });
  }
};

exports.getFormResponsesByFormId = async (req, res) => {
  try {
    const { form_id } = req.params;
    const formResponses = await FormResponse.find({ form_id });
    res.status(200).json(formResponses);
  } catch (error) {
    console.error("Error retrieving form responses:", error);
    res.status(500).json({ error: "Erreur lors de la récupération." });
  }
};

exports.getAllFormResponses = async (req, res) => {
  try {
    const formResponses = await FormResponse.find();
    res.status(200).json(formResponses);
  } catch (error) {
    console.error("Error retrieving form responses:", error);
    res.status(500).json({ error: "Erreur lors de la récupération." });
  }
};
