var express = require('express');
var app = express()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var createError = require('http-errors');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('llave', 'llaveSecretaa');

function auth(req, res, next){
    if(req.originalUrl==='/login'){
        next();
    }else{
        const token = req.headers['access-token'];
        if (token) {
            jwt.verify(token, app.get('llave'), (err, decoded) => {
                if (err) {
                    const err = {
                        status: 401,
                        message: "Token doesnt work"
                    };
                    next(err);
                } else {
                    next();
                }
            });
        } else {
            // const err = new Error('You are not authenticated!');
            const err = {
                status: 401,
                message: "You are not authenticated!"
            };
            return next(err);
        }
    }
}

//Routes
const login = require('./routes/login');
const projects = require('./routes/project');

app.use(auth);
app.use('/login', login(app.get('llave')));
app.use('/projects', projects(app.get('llave')));

app.get('/', (req, res, next) => {
    res.send('Ok')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log(err);
    res.status(err.status || 500);
    res.json({'error': err});
});

module.exports = app;
