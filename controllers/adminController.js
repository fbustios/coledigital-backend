const bd = require('../config/db');
const bcrypt = require('bcryptjs');

exports.addStudent = (req,res) => {
    const {nombre, cedula, correo, telefono, fecha} = req.body;
    const contrasena = bcrypt.hashSync(nombre+cedula, 10);
    const queryEstudiante = 'INSERT INTO Estudiante(cedula,nombre,correo,telefono,fechaNacimiento) values(?,?,?,?,?)';
    const queryUser = 'INSERT INTO Usuarios(username,rol,password_hash,nombre) values (?,?,?,?)';
    bd.query(queryEstudiante, [cedula, nombre, correo, telefono, fecha], (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).json({message: 'Error'});
        }
        bd.query(queryUser,[cedula,'Estudiante',contrasena,nombre],(err2,result) => {
            if(err2){
                console.error('error en users',err2);
                return res.status(500).json({message : 'Error'})
            }
            res.status(201).json({message: 'Registro exitoso'});
            console.log('Registro exitoso');
        })

    });




}