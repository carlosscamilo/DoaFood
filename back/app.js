var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.use(express.json());

// IMPORTE DAS ROTAS /ROUTES
var indexRouter = require('./routes/index');
var benefRouter = require('./routes/beneficiario');
var doadorRouter = require('./routes/doador')
var doacoesRouter = require('./routes/doacoes')

// DEFINE OS END-POINTS/RECURSOS 
app.use('/', indexRouter);
app.use('/beneficiario', benefRouter);
app.use('/doador', doadorRouter)
app.use('/doacoes', doacoesRouter)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({erro:'Not Found'});
});

module.exports = app;
