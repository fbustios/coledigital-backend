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
        const token = jwt.sign({id : user.id, rol : user.rol},'perro',{expiresIn: '3h'});
        res.json({token, user : {id : user.id, username : user.username, rol: user.rol},});
    })

}

