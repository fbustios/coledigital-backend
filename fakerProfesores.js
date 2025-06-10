const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');

const connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'coledigital',
    database: 'coledigital',
    multipleStatements : true,
};

async function insertFakeProfesores(cantidad) {
    const connection = await mysql.createConnection(connectionConfig);

    for (let i = 0; i < cantidad; i++) {
        const nombre = faker.person.fullName();
        const cedula = faker.number.int({ min: 100000000, max: 999999999 });
        const correo = faker.internet.email({ firstName: nombre.split(' ')[0] });
        const telefono = faker.number.int({ min: 60000000, max: 89999999 });
        const fechaNacimiento = faker.date.birthdate({ min: 25, max: 60, mode: 'age' });

        await connection.execute(
            `INSERT INTO profesor (cedula, nombre, correo, telefono, fechaNacimiento) VALUES (?, ?, ?, ?, ?)`,
            [cedula, nombre, correo, telefono, fechaNacimiento.toISOString().split('T')[0]]
        );
    }

    console.log(`${cantidad} profesores insertados exitosamente.`);
    await connection.end();
}

insertFakeProfesores(20);
