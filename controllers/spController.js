const bd = require('../config/db');


exports.getCourses = (req, res) => {
    const { id, rol } = req.body;


    if (rol === 'Profesor') {
        const query = `
            SELECT
                c.id AS clase_id,
                m.nombre AS materia,
                hc.dia,
                hc.inicio,
                hc.fin,
                s.numero AS seccion
            FROM Usuarios u
                     JOIN Profesor p ON u.nombre = p.nombre
                     JOIN ClaseXProfesor cx ON cx.profesor_id = p.id
                     JOIN Clase c ON c.id = cx.clase_id
                     JOIN HorarioClase hc ON hc.clase_id = c.id
                     JOIN Materia m ON m.id = c.materia_id
                     JOIN Seccion s ON s.id = c.seccion_id
            WHERE u.id = ?;
        `;

        bd.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length === 0) {
                return res.status(401).send('No hay clases asignadas');
            }
            res.json({ clases: result });
        });

    }   else {
    const query = `
            SELECT
                c.id AS clase_id,
                m.nombre AS materia,
                hc.dia,
                hc.inicio,
                hc.fin,
                s.numero AS seccion
            FROM Usuarios u
                JOIN Estudiante e ON u.nombre = e.nombre
                JOIN Clase c ON c.seccion_id = e.seccion_id
                JOIN HorarioClase hc ON hc.clase_id = c.id
                JOIN Materia m ON m.id = c.materia_id
                JOIN Seccion s ON s.id = c.seccion_id
            WHERE u.id = ?;
        `;

    bd.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length === 0) {
            return res.status(401).send('No hay clases asignadas');
        }
        res.json({ clases: result });
    });
}
};



exports.agregarMaterialProfesor = (req, res) => {
    const { link_one_drive, clase_id, semestre_id, nombre } = req.body;
    const user = req.user;

    if (user.rol !== 'Profesor') {
        return res.status(403).json({ message: 'No autorizado' });
    }

    const insertLinkQuery = 'INSERT INTO Links (nombre, link_one_drive) VALUES (?, ?)';
    bd.query(insertLinkQuery, [nombre, link_one_drive], (err, linkResult) => {
        if (err) {
            return res.status(500).json({ message: 'Error al agregar el link' });
        }

        const link_id = linkResult.insertId;

        const insertMaterialQuery = 'INSERT INTO Material (semestre_id, link_id, clase_id) VALUES (?, ?, ?)';
        bd.query(insertMaterialQuery, [semestre_id, link_id, clase_id], (err2) => {
            if (err2) {
                return res.status(500).json({ message: 'Error al agregar el material' });
            }

            res.status(201).json({ message: 'Material agregado correctamente' });
        });
    });
};

exports.obtenerMaterialesClase = (req, res) => {
    const { clase_id, semestre_id } = req.body;

    const query = `
        SELECT l.nombre, l.link_one_drive
        FROM Material m
                 JOIN Links l ON l.id = m.link_id
        WHERE m.clase_id = ? AND m.semestre_id = ?
    `;

    bd.query(query, [clase_id, semestre_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al obtener materiales' });
        res.json({ materiales: result });
    });
};

exports.generarReporteNotas = (req, res) => {
    const claseId = req.params.id;
    const userId = req.user.id; // desde el middleware de autenticación
    const userRol = req.user.rol;
    const profesorId = req.user.profesor_id;


    // Validar que sea profesor
    if (userRol !== 'Profesor') {
        return res.status(403).json({ error: 'No autorizado' });
    }

    // Validar que el profesor es dueño de la clase
    const verificarQuery = 'SELECT * FROM ClaseXProfesor WHERE clase_id = ? AND profesor_id = ?';
    bd.query(verificarQuery, [claseId, profesorId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (result.length === 0) return res.status(403).json({ error: 'No autorizado para esta clase' });

        // Obtener estudiantes, notas 1er y 2do semestre
        const query = `
            select e.nombre as nombre_estudiante,  sum(case when n.semestre_id = 1 then (n.nota) * (ev.porcentaje/100) else 0 end) as nota_primer_semestre,
                   sum(case when n.semestre_id = 2 then (n.nota) * (ev.porcentaje/100) else 0 end) as nota_segundo_semestre
            from Estudiante e
                     join notas n on n.estudiante_id = e.id
                     join evaluaciones ev on ev.id = n.evaluacion_id
            where n.clase_id = ?
            group by e.nombre;`;

        bd.query(query, [claseId], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Error obteniendo notas' });

            // Calcular promedios y estado
            const reporte = rows.map(est => {
                const promedio = ((est.nota_primer_semestre || 0) * 0.5) + ((est.nota_segundo_semestre || 0) * 0.5);
                return {
                    nombre_estudiante: est.nombre_estudiante,
                    nota_primer_semestre: est.nota_primer_semestre,
                    nota_segundo_semestre: est.nota_segundo_semestre,
                    promedio_final: promedio.toFixed(2),
                    estado: promedio >= 70 ? 'Aprobado' : 'Reprobado'
                };
            });

            res.json({ claseId, reporte });
        });
    });
};

getFuncionarioID = (usuario_id,rol) => {
    let query = `SELECT e.id
                FROM Usuarios u
                JOIN Estudiante e ON e.nombre = u.nombre
                WHERE u.id = ?`;
    if(rol === 'Profesor') {
        query = `SELECT p.id
            FROM Usuarios u
            JOIN Profesor p ON p.nombre = u.nombre
            WHERE u.id = ?`;
    }

    return new Promise((resolve, reject) => {
        bd.query(query, [usuario_id], (err, result) => {
            if (err) return reject(0)
            if (result.length === 1) return resolve(result[0].id);
            return resolve(0);
        })
    })

}



exports.getNotas = async (req,res) => {
    const {id, claseId, semestreId} = req.body;
    const studentId = await getFuncionarioID(id,'Estudiante');
    const query = `SELECT ev.nombre, n.nota, ev.porcentaje, n.id 
        FROM Notas n
        JOIN Evaluaciones ev ON ev.id = n.evaluacion_id
        WHERE n.estudiante_id = ? AND n.clase_id = ? AND n.semestre_id = ?;`
    bd.query(query,[studentId,claseId,semestreId],(err,result) => {
        if(err) return res.status(500).json({ message: 'Error al obtener notas' });
        res.json({evaluaciones : result})
    })
}

exports.getEstudiantes = async (req,res) => {
    const{id, claseId} =  req.body;
    try {
        const fid = await getFuncionarioID(id, 'Profesor')

        const query = `SELECT e.nombre, u.id
                FROM Clase c
                    JOIN clasexprofesor cx on cx.clase_id = c.id
                    JOIN Estudiante e on e.seccion_id = c.seccion_id
                    JOIN Usuarios u on u.nombre = e.nombre
                    WHERE cx.profesor_id = ? AND c.id = ?;`

        bd.query(query, [fid, claseId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al consultar estudiantes' });
            }
            res.json({ estudiantes: result });

        });
    }catch(err){
        return res.status(500).json({message: 'Error al obtener estudiantes'})
    }
}

exports.editarNota = async (req,res) => {
    const {notaNueva, notaId} = req.body;

        const query = `UPDATE Notas
                       SET nota = ?
                       WHERE id = ?;`
        bd.query(query, [notaNueva, notaId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({message: 'Error al consultar estudiantes'});
            }
            res.json({nada: result})
        })
}