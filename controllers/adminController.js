const bd = require('../config/db');
const bcrypt = require('bcryptjs');

exports.addStudent = (req,res) => {
    const {nombre, cedula, correo, telefono, fecha} = req.body;
    const contrasena = bcrypt.hashSync(nombre+cedula, 10);
    const queryEstudiante = 'INSERT INTO Estudiante(cedula,nombre,correo,telefono,fechaNacimiento) values(?,?,?,?,?)';
    const queryUser = 'INSERT INTO Usuarios(username,rol,password_hash,nombre) values (?,?,?,?)';
    bd.query(queryEstudiante,[nombre, cedula, correo,telefono,fecha],(err,result)=>{
        if(err){
            return res.status(500).send({err})
        }

    });
    res.json();
}