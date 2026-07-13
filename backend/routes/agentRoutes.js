const express = require('express');
const router = express.Router();
const controller = require('../controllers/agentController');

router.post('/query', controller.queryAgent);
router.get('/knowledge-base', controller.getKnowledgeBase);
router.get('/department-contexts', controller.getDepartmentContexts);
router.post('/classify-intent', controller.classifyIntent);
router.get('/health', controller.healthCheck);

module.exports = router;
