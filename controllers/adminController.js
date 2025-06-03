const bd = require('../config/db');
const bcrypt = require('bcryptjs')

exports.addStudent = (req,res) => {
    const {nombre, cedula, correo, telefono, fecha} = req.body;
    const contrasena = bcrypt.hashSync(nombre+cedula, 10);
    res.json();
}