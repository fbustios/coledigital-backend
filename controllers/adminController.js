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

exports.addProfessor = (req,res) => {
    const {nombre, cedula, correo, telefono, fecha} = req.body;
    const contrasena = bcrypt.hashSync(nombre + cedula, 10);
    const queryProfesor = 'INSERT INTO Profesor(cedula,nombre,correo,telefono,fechaNacimiento) values(?,?,?,?,?)';
    const queryUser = 'INSERT INTO Usuarios(username,rol,password_hash,nombre) values (?,?,?,?)';
    bd.query(queryProfesor, [cedula, nombre, correo, telefono, fecha], (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).json({message: 'Error'});
        }
        bd.query(queryUser, [cedula, 'Profesor', contrasena, nombre], (err2, result) => {
            if (err2) {
                console.error('error en users', err2);
                return res.status(500).json({message: 'Error'})
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

exports.reset = (req,res) => {
    const query = 'DELETE FROM ClaseXProfesor;' +
        'UPDATE Material SET link_id = null;' +
        'DELETE FROM Notas;' + 'DELETE FROM Links;' +
        'UPDATE Estudiante SET seccion_id = null;'
    bd.query(query,(err,result) => {
        if(err){
            console.error('Error en el reset');
            return res.status(500).json({messsage : 'Hubo un error en el reset'});
        }
        res.status(200).json({message:'Reset exitoso'});
        console.log('Reset exitoso');
    })

}

exports.addStudentSection = (req,res) => {
    const {cedula, seccion} = req.body;
    const querySeccion = 'SELECT id FROM Seccion WHERE numero = ?;';
    const query = 'UPDATE Estudiante SET seccion_id = ? WHERE cedula = ?;';
    bd.query(querySeccion,[seccion],(err,result) => {
        if(err){
            console.error('Error en el query de seccion');
            return res.status(500).json({message: 'Error en el query de seccion'});
        }
        if(result.length === 0){
            return res.status(401).json({message: 'No existe tal sección'});
        }
        const seccion_id = result[0].id;
        bd.query(query,[seccion_id,cedula],(err,result2) => {
            if(err){
                return res.status(500).json({message: 'Error en el update'});
            }
            res.status(201).json({message : 'Seccion agregada correctamente'});
            console.log('Update exitoso');
        })
    });
}

exports.agregarProfesorAClase = (req, res) => {
    const { cedula, clase_id } = req.body;

    const getProfessorIdQuery = 'SELECT id FROM Profesor WHERE cedula = ?';
    const insertRelationQuery = 'INSERT INTO ClaseXProfesor (profesor_id, clase_id) VALUES (?, ?)';

    bd.query(getProfessorIdQuery, [cedula], (err, result) => {
        if (err) {
            console.error('Error al buscar profesor:', err);
            return res.status(500).json({ message: 'Error al buscar profesor' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }

        const profesor_id = result[0].id;

        bd.query(insertRelationQuery, [profesor_id, clase_id], (err2, result2) => {
            if (err2) {
                console.error('Error al asignar profesor a la clase:', err2);
                return res.status(500).json({ message: 'Error al asignar profesor a la clase' });
            }

            res.status(201).json({ message: 'Profesor asignado a la clase' });
        });
    });
};