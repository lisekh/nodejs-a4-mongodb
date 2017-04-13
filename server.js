var express = require('express');
var app = express();
var path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var routes = require('./routes/routes.js');

app.get('/', routes.home);
app.get('/:city', routes.city);

// Port and start listening
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'));