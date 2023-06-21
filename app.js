var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/userAuth');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
    credentials: true,
    origin: ['http://localhost:3006', 'http://localhost:8080', 'http://localhost:4200']
}))

//Tasks:
//Connect the app with mongo db.
//Create different routes to create, update and delete user.

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Tasks:
//Create a login route and validate user from DB and send JWT Token using JWT Package.
//Create a Middleware function to secure public routes.
app.use('/api', authRouter);


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
  // res.render('error');
});

module.exports = app;
