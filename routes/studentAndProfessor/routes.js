const express = require('express');
const Router = express.Router();
const auth = require('../../middlewares/authToken');
const spController = require('../../controllers/spController');

Router.post('/Dashboard',auth,spController.getCourses);

module.exports = Router;

