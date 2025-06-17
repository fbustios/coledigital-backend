const bd = require('../config/db');


exports.getCourses = (req,res) => {
    const {id,rol} = req.body;

    if(rol === 'Profesor'){
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
        bd.query(query,[id],(err,result) => {
            if(err){
                console.log('me meti')
                return res.status(500).send(err);
            }
            if(result.length === 0){
                console.log('me meti al no resultados');
                return res.status(401).send('No hay clases asignadas');
            }
            res.json({clases:result});
        });
    }else{
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
        bd.query(query,[id],(err,result)=>{
            if(err){

                return res.status(500).send(err);
            }
            if(result.length === 0){

                return res.status(401).send('No hay clases asignadas');
            }
            res.json({clases:result});
        });
    }
}

exports.getStudentId= (req,res) => {
    const {user_id} = req.body;
    const query = 'SELECT e.id FROM Usuarios u JOIN Estudiante e ON u.nombre = e.nombre where u.id = ?';
    //bd.query()

}

exports.agregarMaterialProfesor = (req, res) => {
    const { link_one_drive, clase_id, semestre_id } = req.body;
    const user = req.user;

    if (user.rol !== 'Profesor') {
        return res.status(403).json({ message: 'No autorizado' });
    }

    const insertLinkQuery = 'INSERT INTO Links (link_one_drive) VALUES (?)';
    bd.query(insertLinkQuery, [link_one_drive], (err, linkResult) => {
        if (err) {
            console.error('Error agregar el link:', err);
            return res.status(500).json({ message: 'Error al agregar el link' });
        }

        const link_id = linkResult.insertId;

        const insertMaterialQuery = 'INSERT INTO Material (semestre_id, link_id, clase_id) VALUES (?, ?, ?)';
        bd.query(insertMaterialQuery, [semestre_id, link_id, clase_id], (err2) => {
            if (err2) {
                console.error('Error al agregar el material:', err2);
                return res.status(500).json({ message: 'Error al agregar el material' });
            }

            res.status(201).json({ message: 'Material agregado correctamente' });
        });
    });
};