"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './node_modules/@propertech/svg-icons'))); // To server images from svg-icons

// Middlewares
// app.use(require('./middlewares/basicAuth'));

// API Routes
app.use(require('./api').queueApiRouter);

// Pages Routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
