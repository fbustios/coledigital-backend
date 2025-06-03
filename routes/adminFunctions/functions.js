const express = require('express');
const router = express.Router;

const loginController = require('../../controllers/adminController');
const auth = require('../../middlewares/authToken');