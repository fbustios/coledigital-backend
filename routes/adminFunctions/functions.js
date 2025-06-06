const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const auth = require('../../middlewares/authToken');



router.post('/addStudent',auth,adminController.addStudent);
router.delete('/deleteFuncionario', auth, adminController.deleteFuncionario);


module.exports = router;