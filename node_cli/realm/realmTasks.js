var Realm = require('realm');
var realmAuth = require('./realmAuth');
var schemas = require('./schemas');
var mongodb = require('mongodb');
//import * as auth from "./realmAuth"
//import * as schemas from '../schemas'

async function setRealm(user) {
   console.log('setRealm', user);
   const config = {
      schema: [schemas.taskSchema],//, schemas.Project],
      sync: {
         user: user,
         partitionValue: 'myPartition',
      },
      };
   
      return await Realm.open(config).then(r=>{
         return r;
      });
}

async function getTasks(user) {
   console.log('get tasks')
   return setRealm(user).then(async r => {
      let allTasks =  await r.objects("Task");
      console.log(JSON.stringify(allTasks, null, 3))
      return allTasks;
      });
}

async function getTask(user, taskId){
   return setRealm(user).then(async r => {
      let task = await r.objectForPrimaryKey("Task", mongodb.ObjectID(taskId));
      return task;
   }).catch(err=>{
      console.log(err);
   });
}

async function createTask(user, taskName, taskStatus) {
   return setRealm(user).then(r => {
      try{
         return r.write(function() {
            let t = r.create('Task', 
            { 
               _id: new mongodb.ObjectID(),
               _partition: 'myPartition',
               name: taskName, 
               status: taskStatus, 
               assignee: new mongodb.ObjectID(user.identity) 
            });
            console.log('t', t.name, t.status);
            return t;
         });
      } catch (err) {
         console.log('err', err);
         return null;
      }
 });
}

async function changeTask(user, taskId, field, newValue){
  return setRealm(user).then(async r => {
   try{
      r.beginTransaction() 
         let task = await r.objectForPrimaryKey("Task", mongodb.ObjectID(taskId));
         console.log('you made it this far', JSON.stringify(task, null, 3))
         task[field] = newValue;
         console.log('new task:', JSON.stringify(task, null, 3));
      r.commitTransaction();
      return true;
   } catch (err) {
      console.log('err', err);
      return false;
   }
  });
}

async function deleteTask(user, taskId){
   return setRealm(user).then(async r => {
      try {
         r.beginTransaction();
            let task = await r.objectForPrimaryKey("Task", mongodb.ObjectID(taskId));
            r.delete(task);
         r.commitTransaction();
         return true;
      } catch(err) {
         console.log(err);
         return false;
      };
   });
}

//TODO: watch for task changes!

module.exports.getTask = getTask;
module.exports.changeTask = changeTask;
module.exports.getTasks = getTasks;
module.exports.createTask = createTask;
module.exports.deleteTask = deleteTask;