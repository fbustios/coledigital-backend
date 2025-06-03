const express = require('express');
const app = express();
const cors = require('cors');




app.use(cors({
    origin: 'http://localhost:3000'}
));

const loginRouter = require('./routes/login/login');
app.use(express.json());
app.use('/login',loginRouter);

app.listen(8080);