const bcrypt = require('bcryptjs');

const password = 'miclave123'; // <-- aquí poné la contraseña que querés

bcrypt.hash(password, 10, function(err, hash) {
    if (err) throw err;
    console.log('Hash generado:');
    console.log(hash);
});
