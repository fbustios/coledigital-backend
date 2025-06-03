const mysql2 = require('mysql2');
require('dotenv').config();


const database = process.env["DB_NAME"];

const connection = mysql2.createConnection({
    host:'10.100.37.81',
    user:'username',
    password:'remoto29072108',
    database:'coledigital',
})

connection.connect((err) => {
    if(err){
        console.error('no me pude conectar a la base',err.message);
    } else{
        console.log('Me conecté a la base');
    }
})

module.exports = connection;