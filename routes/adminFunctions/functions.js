const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const auth = require('../../middlewares/authToken');



router.post('/addStudent',auth,adminController.addStudent);
router.delete('/deleteFuncionario', auth, adminController.deleteFuncionario);
router.post('/addProfessor',auth,adminController.addProfessor);
router.delete('/reset',auth,adminController.reset);
router.post('/sectionStudent',auth,adminController.addStudentSection);


module.exports = router;