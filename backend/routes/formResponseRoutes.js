const express = require("express");
const router = express.Router();
const {
  createFormResponse,
  deleteFormResponse,
  getFormResponsesByUserId,
  getFormResponsesByFormId,
  getAllFormResponses,
} = require("../controllers/formResponseController");

router.post("/form_response", createFormResponse);
router.delete("/form_response/:id", deleteFormResponse);
router.get("/form_responses/user/:user_id", getFormResponsesByUserId);
router.get("/form_responses/form/:form_id", getFormResponsesByFormId);
router.get("/form_responses", getAllFormResponses);

module.exports = router;
