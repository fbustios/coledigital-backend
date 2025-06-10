const bd = require('../config/db');


exports.getCourses = (req,res) => {
    const {id,rol} = req.body;
    if(rol === 'Profesor'){
        const query = 'SELECT m.id, m.nombre from ClaseXProfesor cx JOIN Clase c on c.id = cx.clase_id JOIN Materia m on c.materia_id = m.id WHERE cx.profesor_id = ?;'
        bd.query(query,[id],(err,result) => {
            if(err){
                console.log('me meti')
                return res.status(500).send(err);
            }
            if(result.length === 0){
                console.log('me meti al no resultados')
                return res.status(401).send('No hay clases asignadas');
            }
            console.log('me meti sin problemas')
            res.json({clases:result});
        });
    }else{
        const query = '';

    }
}