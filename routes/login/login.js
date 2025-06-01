const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/loginController');
const auth = require('../../middlewares/authToken');

router.post('/',loginController.login);



module.exports = router;