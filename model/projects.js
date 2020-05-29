const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasks = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
})

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    tasks: [tasks]
}, {
    timestamps: true
});

var Projects = mongoose.model('Project', projectSchema);

module.exports = Projects;