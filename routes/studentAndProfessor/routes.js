const express = require('express');
const Router = express.Router();
const auth = require('../../middlewares/authToken');
const spController = require('../../controllers/spController');
const authRol = require('../../middlewares/authRol');

Router.post('/Dashboard',auth,spController.getCourses);
Router.post('/agregarMaterial', auth, spController.agregarMaterialProfesor);
Router.post('/materialesClase', auth, spController.obtenerMaterialesClase);
Router.get('/clase/:id/reporte', auth, spController.generarReporteNotas)
Router.post('/Dashboard/Clase/Notas/NotasPersonales',auth,spController.getNotas);
Router.post('/Dashboard/Clase/Notas/Estudiantes',auth,spController.getEstudiantes);
Router.post('/Dashboard/Clase/Notas/NotasPersonales/Update',auth,spController.editarNota);

module.exports = Router;

