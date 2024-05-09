const express = require('express');
const router = express.Router();
const sequenceController = require('../controllers/sequence.controller');
const { authenticateToken } = require('../middlewares/auth')
router.post('/login-user',sequenceController.loginUser);
router.post('/save-sequence', authenticateToken, sequenceController.saveSequence);
router.post('/update-sequence', authenticateToken, sequenceController.updateSequence);
router.get('/sequences', authenticateToken, sequenceController.getAllSequences); 
router.get('/load-sequence/:sqName', authenticateToken, sequenceController.getSequenceByName); 
router.get('/verify-token', sequenceController.verifyToken); 
router.delete('/delete-sequence/:sqName', authenticateToken, sequenceController.deleteSequence);
router.post('/execute-sequence', authenticateToken, sequenceController.executeSequence);

module.exports = router;
