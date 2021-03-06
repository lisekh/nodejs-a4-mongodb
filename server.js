var express = require('express');
var app = express();

var path = require('path');
var chalk = require('chalk');
// First mongoose then db
var mongoose = require('mongoose');
var db = require('./models/db.js');

// Session handling
var session = require('express-session');
app.use(session({secret:"mysecret", resave: true, saveUninitialized:true}));

// BodyParser so easily pase body of post objects, and make it available under req.body property.
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// View engine and static folder
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Routes
var routes = require('./routes/routes.js');
app.get('/', routes.index);
app.get('/register', routes.register);
app.get('/login', routes.login);
app.get('/techStack', routes.techStack);
app.get('/new-story', routes.newStory);

// User routes
var user = require('./routes/user.js');
app.post('/newUser', user.createUser);
app.get('/registrated', user.userRegistrated);
app.post('/auth', user.login);
app.get('/logout', user.logout);

var story = require('./routes/story.js');
app.get('/stories', story.stories);
app.post('/add-story', story.addStory);
app.get('/saveComment', story.saveComment);
app.get('/stories/:story',story.getStory);
app.post('/stories/:slug/saveComment',story.saveComment);

// Error handling
app.use(function(req, res) {
     console.log(chalk.red("404 error"));
     res.status(404).render('404');
});

app.use(function(error, req, res, next) {
     console.log(chalk.red('500 error'));
     res.status(500).render('500');
});

// Port and start listening
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), function(req, res) {
    console.log(chalk.green("Server is listening..."))
});