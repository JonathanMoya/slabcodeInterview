const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://jonathanmoya:jonathanmoya@cluster0-1kxsi.mongodb.net/test?retryWrites=true&w=majority\n";

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
    if (err) throw err;
    var dbo = db.db("slabcode");
});

exports.authUser = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        dbo.collection("users").find(data).toArray((err, result) => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (result.length === 1) {
                resolve('login');
            } else {
                reject('Credenciales invalidas');
            }
            db.close();
        })
    });
})

exports.createProject = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        data.id = new Date().getTime().toString();
        data.tasks = [];
        data.complete = false;
        dbo.collection("projects").insertOne(data, function (err, res) {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            resolve('Ok');
            db.close();
        });
    });
});


exports.getProject = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        dbo.collection("projects").find({id: data.id}).toArray((err, result) => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (result[0].author === data.author) {
                if (result.length === 1) {
                    resolve(result[0]);
                } else {
                    reject('Error encontrando el archivo');
                }
            } else {
                reject('No tiene autorizacion');
            }
            db.close();
        })
    });
})

exports.updateProject = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        var query = {id: data.id, author: data.author};
        var newValues = {description: data.description, name: data.name}
        if (data.description === '' || data.description === undefined) {
            delete newValues.description;
        } else if (data.name === '' || data.name === undefined) {
            delete newValues.name;
        }
        dbo.collection("projects").updateOne(query, {$set: newValues}).then(r => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (r.result.ok === 1) {
                resolve('Ok');
            } else {
                reject('Error subiendo las modificaciones')
            }
            db.close();
        }, err => {
            console.log(err);
        }).catch(e => console.log(e));
    });
});

exports.checkCompleteProject = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        dbo.collection("projects").find({id: data.id}).toArray((err, result) => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            result[0].tasks.forEach((el, index) => {
                if (!el.complete) {
                    reject('Tarea(s) sin completar');
                }
                if (index === result[0].tasks.length - 1) {
                    resolve('Tarea(s) completada(s)')
                }
            })
            db.close();
        })
    });
})

exports.completeProject = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        var query = {id: data.id};
        dbo.collection("projects").updateOne(query, {$set: {complete: true}}).then(r => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (r.result.ok === 1) {
                resolve('Ok');
            } else {
                reject('Error subiendo las modificaciones')
            }
            db.close();
        }, err => {
            console.log(err);
        }).catch(e => console.log(e));
    });
})

exports.deleteProject = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("slabcode");
        dbo.collection("projects").deleteOne(data, function (err, obj) {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            resolve('Elemento eliminado');
            db.close();
        });
    });
});

exports.createTask = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        var query = {id: data.id, author: data.author};
        data.task.id = new Date().getTime().toString();
        data.task.complete = false
        dbo.collection('projects').updateOne(query, {
            $push: {
                tasks: data.task
            }
        }).then(r => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (r.result.ok === 1) {
                resolve('Ok');
            } else {
                reject('Error subiendo las modificaciones')
            }
            db.close();
        })
    });
})

exports.editTask = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        var query = {id: data.id, author: data.author};
        var newValues = {"tasks.$[elem1].description": data.description, "tasks.$[elem1].name": data.name}
        if (data.description === '' || data.description === undefined) {
            delete newValues["tasks.$[elem1].description"];
        } else if (data.name === '' || data.name === undefined) {
            delete newValues["tasks.$[elem1].name"];
        }
        dbo.collection('projects').updateOne(query, {
            $set: newValues
        }, {
            arrayFilters:
                [
                    {"elem1.id": data.taskID}
                ]
        }).then(r => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (r.result.nModified === 1) {
                resolve('Ok');
            } else {
                reject('No hubo modificaciones')
            }
            db.close();
        });
    });
})

exports.TaskComplete = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        var query = {id: data.id, author: data.author};
        dbo.collection('projects').updateOne(query, {
            $set: {
                "tasks.$[elem1].complete": true,
            }
        }, {
            arrayFilters:
                [
                    {"elem1.id": data.taskID}
                ]
        }).then(r => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (r.result.nModified === 1) {
                resolve('Ok');
            } else {
                reject('No hubo modificaciones')
            }
            db.close();
        });
    });
})

exports.deleteTask = (data) => new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('slabcode');
        var query = {id: data.id, author: data.author};
        dbo.collection('projects').findOneAndUpdate(query, {
            $pull: {
                "tasks": {id: data.taskID},
            }
        }).then(r => {
            if (err) reject('Error en la base de datos')
            if (err) throw err;
            if (r.ok === 1) {
                resolve('Ok');
            } else {
                reject('No hubo modificaciones')
            }
            db.close();
        }).catch(e => {
            if (err) reject('Error en la base de datos')
        });
    });
})