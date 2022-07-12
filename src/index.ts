import express from 'express'
require('dotenv').config();
const port = process.env.port || 8000;
const app = express();
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/main'))

app.listen(port, () => { console.log('server running on port', port) });
