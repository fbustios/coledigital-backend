const bd = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
require('dotenv').config();


exports.login = (req,res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(401).send("Username and password is required");
    }
    const query = 'SELECT * FROM Usuarios WHERE username = ?';
    bd.query(query,[username],async (err,result) => {
        if(err){
            return res.status(500).send(err);
        }
        if(result.length === 0){
            return res.status(401).send("Credenciales inválidas");
        }
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(401).send("Contraseña incorrecta");
        }

        const userData = {
            id: user.id,
            username: user.username,
            rol: user.rol
        };


        if (user.rol === 'Profesor') {
            const profQuery = 'SELECT id FROM Profesor WHERE nombre = ?';
            bd.query(profQuery, [user.nombre], (err2, profResult) => {
                if (err2) return res.status(500).send("Error buscando profesor");

                if (profResult.length === 0) return res.status(403).send("No se encontró el profesor");

                const profesorId = profResult[0].id;
                userData.profesor_id = profesorId;

                const token = jwt.sign(userData, 'perro', { expiresIn: '1h' });

                return res.json({ token, user: userData });
            });
        } else {
            const token = jwt.sign(userData, 'perro', { expiresIn: '1h' });
            return res.json({ token, user: userData });
        }
    })

}

