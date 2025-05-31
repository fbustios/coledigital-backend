const express = require('express');
const app = express();

const loginRouter = require('./routes/login/login');
app.use(express.json());
app.use('/login',loginRouter);

app.listen(8080);