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

async function getSecciones(connection) {
    const [rows] = await connection.execute('SELECT id FROM seccion');
    return rows.map(row => row.id);
}

async function insertFakeEstudiantes(cantidad) {
    const connection = await mysql.createConnection(connectionConfig);

    const secciones = await getSecciones(connection);
    if (secciones.length === 0) {
        console.error("⚠️ No hay secciones en la tabla `seccion`. Inserte secciones primero.");
        return;
    }

    for (let i = 0; i < cantidad; i++) {
        const nombre = faker.person.fullName();
        const cedula = faker.number.int({ min: 100000000, max: 999999999 });
        const correo = faker.internet.email({ firstName: nombre.split(' ')[0] });
        const telefono = faker.number.int({ min: 60000000, max: 89999999 });
        const fechaNacimiento = faker.date.birthdate({ min: 10, max: 18, mode: 'age' });
        const seccion_id = faker.helpers.arrayElement(secciones);

        await connection.execute(
            `INSERT INTO estudiante (cedula, nombre, correo, telefono, fechaNacimiento, seccion_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [cedula, nombre, correo, telefono, fechaNacimiento.toISOString().split('T')[0], seccion_id]
        );
    }

    console.log(`${cantidad} estudiantes insertados exitosamente.`);
    await connection.end();
}

insertFakeEstudiantes(50);
