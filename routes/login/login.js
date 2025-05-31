const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/loginController');

router.get('/',loginController.getUserPassword);

module.exports = router;