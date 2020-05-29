const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
const bd = require('../bd');

const loginRouter = express.Router();

loginRouter.use(bodyParser.json());

let llave = '';

loginRouter.route('/')
    .get((req, res, next) => {
        res.send('GET operation is not supported in /login');
    })
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        if (token) {
            jwt.verify(token, llave, (err, decoded) => {
                if (err) {
                    return res.json({mensaje: 'Token inválida'});
                } else {
                    res.send('Already logged');
                }
            });
        } else {
            bd.authUser({user: req.body.user, password: req.body.password}).then(response => {
                const payload = {
                    check: true,
                    name: req.body.user
                };
                const token = jwt.sign(payload, llave, {
                    expiresIn: 600000
                });
                res.json({
                    token: token,
                });
            }).catch(e => {
                res.send(e);
            })
        }
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in login');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in login')
    })

module.exports = (llaveC) => {
    llave = llaveC;
    return loginRouter
};
