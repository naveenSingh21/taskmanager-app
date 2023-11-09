const express = require('express');
const app = express();
const port =8000;
const connectDB = require('./db/dbConnection');
const Task = require('./db/task');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

//Middleware to parsing json

app.use(express.json());

//Enable cors
app.use(cors())

app.post('/tasks',async(req,res)=>{
    try{
        console.log(req.body);
        const task = new Task(req.body)
        await task.save()
        res.status(201).json({message:'task added'})
    }
    catch(error){
        res.status(500).json({error:'task not added'})
    }
})

app.get('/items', async(req, res) => {
    try{
        const items = await Task.find({})
        res.json(items)
    }
    catch(e){
        console.log(e)
    }
  });
app.delete('/delete/',async(req,res)=>{
    if(Object.keys(req.query).length>1){
        const _id = req.query.id;
        const index = req.query.index
        const objectId = new ObjectId(_id);
        try{
            const task = await Task.findOne({_id:objectId},{'assignee':1}).lean();
            if (!task) {
                return res.status(404).json({ message: 'Document not found.' });
            }
        
            if(task.assignee.length>0){
                task.assignee.splice(index,1)
                await Task.findByIdAndUpdate(objectId,{assignee:task.assignee},{new:true}) 
                return res.status(200).json({ message: 'Element deleted successfully.' });   

            }}
        catch (error) {
            console.error('Error deleting element:', error);
            return res.status(500).json({ message: 'Internal server error.' });
          }
        



    }else{
    task_id = req.query.id
    console.log(req.query)
    const delete_res = await Task.findByIdAndDelete(task_id)
    res.json("Task deleted")
    }

})

app.patch('/update/:id',async(req,res)=>{
    try{
        task_id = req.params.id;
        if(Object.keys(req.body)[0]==='assignee'){
            console.log(req.body)
            const objectId = new ObjectId(task_id);
            const task = await Task.findOne({_id:objectId},{'assignee':1}).lean();
            console.log("---------------",task)
            task.assignee.push(Object.values(req.body)[0]);
            await Task.findByIdAndUpdate(task_id,{assignee:task.assignee},{new:true})       

            console.log(task.assignee);
        }else{
        await Task.findByIdAndUpdate(task_id,req.body,{new:true})       
        console.log("req -- ",Object.keys(req.body)[0]);
        }
        res.json({ message: 'Resource updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal error', error: error.message });
        
    }
    });
      
 

connectDB()
app.listen(port,()=>{
    console.log('Server is running on post 8000');
    
});
