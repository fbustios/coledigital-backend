const connection = require('../config/db');

exports.getUserPassword = (req,res) => {
    res.send('hola desde el login controller');
}