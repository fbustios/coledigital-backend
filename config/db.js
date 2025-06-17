const mysql2 = require('mysql2');
require('dotenv').config();


const database = process.env["DB_NAME"];

const connection = mysql2.createConnection({
    host: 'localhost',
    port: '3306', // puerto local por defecto de MySQL
    user: 'root',
    password: 'coledigital',
    database: 'coledigital',
    multipleStatements : true,
})

connection.connect((err) => {
    if(err){
        console.error('no me pude conectar a la base',err.message);
    } else{
        console.log('Me conecté a la base');
    }
})

module.exports = connection;