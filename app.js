var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var hbars = require('express-handlebars');
var chalk = require('chalk');
var db = require('./models/db.js');  // db.js must be required before routes.js
var routes = require('./routes/routes.js');
var app = express();

app.use(express.static(__dirname + "/public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use(session({secret: "secret",  resave : true,  saveUninitialized : false}));

app.set('view engine', 'handlebars');
app.engine('handlebars', hbars({}));

app.get('/adminlogin', routes.adminloginHandler);
app.get('/', routes.loginHandler);
app.get('login', routes.loginHandler);
app.get('/adminlogout', routes.adminlogoutHandler);
app.get('/logout', routes.logoutHandler);
app.get('/feedbackForm', routes.feedbackFormHandler);
app.post('/feedback', routes.feedbackSubmitHandler);
app.get('/feedbackdetailsForm', routes.feedbackdetailsFormHandler);
app.get('/userdetailsForm', routes.userdetailsFormHandler);
app.get('/landingpage', routes.landingpageHandler);
app.get('/landingpage2', routes.landingpage2Handler);
app.get('/adminlandingpage', routes.adminlandingpageHandler);


app.get('/edit', routes.editPageHandler);
app.post('/saveChanges', routes.saveChangesHandler);
app.get('/delete', routes.deletePageHandler);


app.post('/auth', routes.authHandler);
app.post('/adminauth', routes.adminauthHandler);
app.get('/registerForm', routes.registerFormHandler);
app.post('/register', routes.registerSubmitHandler);

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('HTTP server is listening on port: ' + port);
});