const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const auth = require('../../middlewares/authToken');
const authRole = require('../../middlewares/authRol')



router.post('/addStudent',auth,authRole(['Director']),adminController.addStudent);
router.delete('/deleteFuncionario', auth, authRole(['Director']), adminController.deleteFuncionario);
router.post('/addProfessor',auth, authRole(['Director']),adminController.addProfessor);
router.delete('/reset',auth,authRole(['Director']),adminController.reset);
router.post('/sectionStudent',auth,authRole(['Director']),adminController.addStudentSection);
router.post('/asignarProfesorClase',auth,authRole(['Director']), adminController.agregarProfesorAClase);


module.exports = router;