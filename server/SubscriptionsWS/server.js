const express = require('express');
const bodyParser = require('body-parser');

const membersController=require('./controllers/membersController');
const moviesController=require('./controllers/moviesController');
const subscriptionsController=require('./controllers/subscriptionsController');

const app=express();

app.use(bodyParser.urlencoded({extended:true}))
.use(bodyParser.json());

require('./configs/database');

app.use('/api/members',membersController);
app.use('/api/movies',moviesController);
app.use('/api/subscriptions',subscriptionsController);

app.listen(8001);
