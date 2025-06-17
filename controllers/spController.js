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