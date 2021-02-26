const express = require('express');
const bodyParser = require('body-parser');

const usersController=require('./controllers/usersController');
const authController=require('./controllers/authController');

const app=express();

app.use(bodyParser.urlencoded({extended:true}))
.use(bodyParser.json());

require('./configs/database');

app.use('/api/users',usersController);
app.use('/auth',authController);

app.listen(8001);
