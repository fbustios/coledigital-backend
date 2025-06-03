const express = require('express');
const app = express();
const cors = require('cors');




app.use(cors({
    origin: 'http://localhost:3000'}
));

const loginRouter = require('./routes/login/login');
const adminRouter = require('./routes/adminFunctions/functions');
app.use(express.json());
app.use('/login',loginRouter);
app.use('/adminPage',adminRouter);

app.listen(8080);