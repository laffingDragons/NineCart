var express  = require('express');
var app      = express();
var path = require('path');
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var favicon = require('serve-favicon');

var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var expressHbs = require('express-handlebars');
var validator = require('express-validator');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport');

var routes = require('./routes/index')
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //keep log of tHings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
/*app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));*/
app.use(flash()); //FOr showing flash messages to user
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

/*app.use('/user', userRoutes);*/
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

//Listening on port
app.listen(port);
console.log('The magic happens on port ' + port);