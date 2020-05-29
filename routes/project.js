const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bd = require('../bd');

const projectRouter = express.Router();

projectRouter.use(bodyParser.json());

let llave = '';

projectRouter.route('/')
    .get((req, res, next) => {
        //TODO enviar proyectos
        res.send('Send all projects');
    })
    .post((req, res, next) => {
        if (!(req.body.name === undefined || req.body.name === '') && !(req.body.description === undefined || req.body.description === '')) {
            const token = req.headers['access-token'];
            bd.createProject({
                name: req.body.name,
                description: req.body.description,
                author: jwt.decode(token).name
            }).then(response => {
                res.json(response);
            }).catch(e => {
                res.json({err: e});
            })
        } else if (req.body.name === undefined || req.body.name === '') {
            res.send('Se necesita un nombre para crear el proyecto')
        } else if (req.body.description === undefined || req.body.description === '') {
            res.send('Se necesita una descripcion para crear el proyecto')
        }
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in projects');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in projects')
    })

projectRouter.route('/:id/edit')
    .get((req, res, next) => {
        res.send('GET isnt supported in projects');
    })
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        bd.getProject({
            id: req.params.id,
            author: jwt.decode(token).name
        }).then(response => {
            return bd.updateProject({
                id: req.params.id,
                author: jwt.decode(token).name,
                description: req.body.description,
                name: req.body.name
            })
        }).then(response => {
            res.json(response);
        }).catch(e => {
            res.json({err: e});
        })
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in projects');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in projects')
    })

projectRouter.route('/:id/complete')
    .get((req, res, next) => {
        res.send('GET isnt supported in projects');
    })
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        bd.getProject({
            id: req.params.id,
            author: jwt.decode(token).name
        }).then(response => {
            return bd.checkCompleteProject({
                id: req.params.id,
            })
        }).then(response => {
            return bd.completeProject({
                id: req.params.id,
            })
        }).then(response=>{
            res.send(response);
        }).catch(e => {
            res.json({err: e});
        })
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in projects');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in projects')
    })

projectRouter.route('/:id/delete')
    .get((req, res, next) => {
        res.send('GET isnt supported in projects');
    })
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        bd.getProject({
            id: req.params.id,
            author: jwt.decode(token).name
        }).then(response => {
            return bd.deleteProject({
                id: req.params.id,
            })
        }).then(response=>{
            res.send(response);
        }).catch(e => {
            res.json({err: e});
        })
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in projects');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in projects')
    })

projectRouter.route('/:id/tasks')
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        if (!(req.body.name === undefined || req.body.name === '')) {
            let task = {
                name: req.body.name
            }
            if (!(req.body.description === undefined || req.body.description === '')) {
                task.description = req.body.description
            }
            bd.getProject({
                id: req.params.id,
                author: jwt.decode(token).name
            }).then(response => {
                return bd.createTask({
                    id: req.params.id,
                    author: jwt.decode(token).name,
                    task: task
                })
            }).then(response => {
                res.send(response);
            }).catch(e => {
                res.send(e)
            })
        } else {
            res.send('Debe incluir el nombre de la tarea')
        }
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in tasks');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in tasks')
    })

projectRouter.route('/:id/tasks/:idTask/edit')
    .post((req, res, next) => {

        const token = req.headers['access-token'];
        bd.getProject({
            id: req.params.id,
            author: jwt.decode(token).name
        }).then(response => {
            return bd.editTask({
                id: req.params.id,
                author: jwt.decode(token).name,
                description: req.body.description,
                name: req.body.name,
                taskID: req.params.idTask
            })
        }).then(response => {
            res.json(response);
        }).catch(e => {
            res.json({err: e});
        })
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in projects');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in projects')
    })

projectRouter.route('/:id/tasks/:idTask/complete')
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        bd.getProject({
            id: req.params.id,
            author: jwt.decode(token).name
        }).then(response => {
            return bd.TaskComplete({
                id: req.params.id,
                author: jwt.decode(token).name,
                taskID: req.params.idTask
            })
        }).then(response => {
            res.json(response);
        }).catch(e => {
            res.json({err: e});
        })
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in tasks');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in tasks')
    })

projectRouter.route('/:id/tasks/:idTask/delete')
    .post((req, res, next) => {
        const token = req.headers['access-token'];
        bd.getProject({
            id: req.params.id,
            author: jwt.decode(token).name
        }).then(response => {
            return bd.deleteTask({
                id: req.params.id,
                author: jwt.decode(token).name,
                taskID: req.params.idTask
            })
        }).then(response => {
            res.json(response);
        }).catch(e => {
            res.json({err: e});
        })
    })
    .put((req, res, next) => {
        res.send('PUT isnt supported in tasks');
    })
    .delete((req, res, next) => {
        res.send('DELETE isnt supported in tasks')
    })

module.exports = (llaveC) => {
    llave = llaveC;
    return projectRouter
};
