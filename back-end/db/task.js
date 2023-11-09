const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    due_date:{
        type:String,
        require:true
    },
    priority:{
        type:String,
        require:true
    },
    assignee:{
        type:Array ,
        require:true
    }
})

const tasks = mongoose.model('tasks',taskSchema)
module.exports = tasks;