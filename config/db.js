const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ColeDigital',
    database: 'ColeDigital',
})

connection.connect((err) => {
    if(err){
        console.error('no me pude conectar a la base',err.message);
    } else{
        console.log('Me conecté a la base');
    }
})

module.exports = connection;