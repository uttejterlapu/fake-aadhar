// app.js
const express = require('express');
const cookieParser = require("cookie-parser");

require('dotenv').config();

const db = require('./DataBase/db')
const app = express();

db();

// app.use(require('./middleware/apiKeyInUrl'));
app.use(cookieParser());  
app.use(express.json());

app.use('/api/aadhaar', require('./routes/aadhaar'));
app.use('/api/auth', require('./routes/user'));

module.exports = app;  