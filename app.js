require('dotenv').config();
var createError = require('http-errors');
const connectDB = require('./config/db');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoutes');
var categorysRouter = require('./routes/categorysRoutes');
var articlesRouter = require('./routes/articlesRoutes');
const commentRouter = require('./routes/commentsRoutes');

//cors 
const cors = require('cors');

// connect to database MB
connectDB();

var app = express();

// Enable CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categorysRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentRouter);


// 404 handler - Page Not Found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
