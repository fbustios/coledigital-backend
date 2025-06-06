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

exports.deleteFuncionario = (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ message: "Falta la cédula en el body" });
    }

    const queryDeleteEstudiante = 'DELETE FROM Estudiante WHERE cedula = ?';
    bd.query(queryDeleteEstudiante, [cedula], (err, resultEstudiante) => {
        if (err) {
            console.error('Error eliminando de Estudiante:', err);
            return res.status(500).json({ message: 'Error eliminando estudiante' });
        }

        const queryDeleteProfesor = 'DELETE FROM Profesor WHERE cedula = ?';
        bd.query(queryDeleteProfesor, [cedula], (err, resultProfesor) => {
            if (err) {
                console.error('Error eliminando de Profesor:', err);
                return res.status(500).json({ message: 'Error eliminando profesor' });
            }

            const queryDeleteUsuario = 'DELETE FROM Usuarios WHERE username = ?';
            bd.query(queryDeleteUsuario, [cedula], (err, resultUsuario) => {
                if (err) {
                    console.error('Error eliminando usuario:', err);
                    return res.status(500).json({ message: 'Error eliminando usuario' });
                }

                res.status(200).json({ message: 'Funcionario eliminado correctamente' });
            });
        });
    });
};

