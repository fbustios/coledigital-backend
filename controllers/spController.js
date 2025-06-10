const bd = require('../config/db');


exports.getCourses = (req,res) => {
    const {id,rol} = req.body;

    if(rol === 'Profesor'){
        const query = 'SELECT c.id, m.nombre, c.inicio from Usuarios u JOIN Profesor p ON u.nombre = p.nombre JOIN ClaseXProfesor cx ON cx.profesor_id = p.id JOIN Clase c on c.id = cx.clase_id JOIN Materia m on c.materia_id = m.id WHERE u.id = ?;'
        bd.query(query,[id],(err,result) => {
            if(err){
                console.log('me meti')
                return res.status(500).send(err);
            }
            if(result.length === 0){
                console.log('me meti al no resultados');
                return res.status(401).send('No hay clases asignadas');
            }
            console.log('me meti sin problemas');
            res.json({clases:result});
        });
    }else{
        const query = 'SELECT c.id, m.nombre, c.inicio FROM Usuarios u JOIN Estudiante e ON e.nombre = u.nombre  JOIN ClaseXSeccion cs ON cs.seccion_id = e.seccion_id JOIN Clase c ON c.id = cs.clase_id JOIN Materia m ON m.id = c.materia_id WHERE u.id = ?;';
        bd.query(query,[id],(err,result)=>{
            if(err){
                console.log('me meti')
                return res.status(500).send(err);
            }
            if(result.length === 0){
                console.log('me meti al no resultados');
                return res.status(401).send('No hay clases asignadas');
            }
            console.log('me meti sin problemas');
            res.json({clases:result});
        });
    }
}