'use strict';

var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var debug          = require('debug');
var session        = require('express-session');
var compress       = require('compression');
var flash          = require('connect-flash');
var helmet         = require('helmet');
var mongoStore     = require('connect-mongo')(session);
var flash          = require('connect-flash');
var path           = require('path');
var mongoose       = require('mongoose');
var passport       = require('passport');
var dotenv         = require('dotenv');

// Load .env variables
dotenv.load();

var app            = express();

// Set config env route
process.env.NODE_CONFIG_DIR = './config/env';
var config         = require('config');

// DB connection
var db = config.get('db');
mongoose.connect(db, function(err) {
    if (err) {
        console.log('Could not connect to MongoDB!');
        console.log(err);
    }
});

// Globbing model files
var utils = require('./config/utils.js');
utils.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
    require(path.resolve(modelPath));
});

// Setting application local variables
app.locals.title = config.app.title;
app.locals.description = config.app.description;
app.locals.keywords = config.app.keywords;
app.locals.jsFiles = utils.getJavaScriptAssets();
app.locals.cssFiles = utils.getCSSAssets();

// Passing the request url to environment locals
app.use(function(req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
});


// Compress { Place before express.static }
app.use(compress({
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));

// Show stack errors
app.set('showStackError', true);

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.enable('trust proxy');


// Request body parsing middleware should be above methodOverride
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// Enable JSONP
app.enable('jsonp callback');

app.use(cookieParser());

// Express MongoDB session storage
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new mongoStore({
        db: mongoose.connection.db
    })
}));
// Cross-site request forgery protection
// app.use(require('csurf')());
// app.use(function(req, res, next) {
//     res.locals._csrfToken = req.csrfToken();
//     next();
// });

// Bootstrap passport config
require('./config/passport')();

// Passport session
app.use(passport.initialize());
app.use(passport.session());

// Flash messages 
app.use(flash());

// Helmet to secure Express headers
app.use(helmet.xframe());
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.use(helmet.ienoopen());
app.disable('x-powered-by');

// Setting the app router and static folder
app.use(express.static(path.resolve('./public')));

// Globbing routing files
utils.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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

function startServer() {
    app.listen(config.port, function() {
      console.log('Express server listening on port ' + config.port + 
                  ' in ' + app.get('env') + ' mode.');
    });
}

if(require.main === module) {
    // application run directly
    startServer();
} else {
    // application imported as a module via "require"
    module.exports = startServer;
}





