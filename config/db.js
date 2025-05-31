const mysql2 = require('mysql2');
require('dotenv').config();


const database = process.env["DB_NAME"];

const connection = mysql2.createConnection({
    host:'localhost',
    user:'root',
    password:'29072108',
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