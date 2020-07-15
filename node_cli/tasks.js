const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

var realmTasks = require('./realm/realmTasks');
var index = require('./index');

exports.getTasks = async(user)=>{
   return await realmTasks.getTasks(user).then(tasks=>{
      index.output('MY TASKS:', 'header');
      index.output(JSON.stringify(tasks, null, 3), 'result')
   })
}

exports.createTask = async(user)=>{
   index.output('*** CREATE NEW TASK ***', 'header');
   return await inquirer.prompt([
      {
         type: 'input',
         name: 'name',
         message: 'What is the task text?',
      },{
         type: 'rawlist',
         name: 'status',
         message: 'What is the task status?',
         choices: ['Open', 'In Progress', 'Closed'],
         default: function () {
            return 'Open';
      }
   }]).then(async task=>{
      await realmTasks.createTask(user, task.name, task.status).then(result=>{
         index.output('New task created', 'header');
         index.output(JSON.stringify(result, ' ', 3), 'result');
         return;
      })
   }).catch(err => {
      return index.output(err, "error")
   });
}

exports.getTask = async(user)=>{
   return await inquirer.prompt([
      {
         type: 'input',
         name: 'id',
         message: 'What is the task ID (_id)?',
      }
   ]).then(async task =>{
      let result = await realmTasks.getTask(user, task.id);
      if (result !== undefined) {
         index.output('Here is the task you requested:', 'header');
         index.output(JSON.stringify(result, ' ', 3), 'result');
      }
      return;
   }).catch(err => {
      return index.output(err, "error")
   });
}

exports.deleteTask = async(user)=>{
   index.output('DELETE A TASK', 'header');
   return await inquirer.prompt([
   {
      type: 'input',
      name: 'id',
      message: 'What is the task ID (_id)?',
   },{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to delete this task?'
   }]).then(async answers=>{
      if (answers.confirm){
         await realmTasks.deleteTask(user, answers.id).then(r=>{
            if (r) index.output('Task deleted.', 'result');
            return;
         })
      }
      return;
   })
}

exports.editTask = async(user)=>{
   index.output('CHANGE A TASK', 'header');
   return await inquirer.prompt([
   {
      type: 'input',
      name: 'id',
      message: 'What is the task ID (_id)?',
   },{
      type: 'input',
      name: 'key',
      message: 'What is the field you want to change?',
   },{
      type: 'input',
      name: 'value',
      message: 'What is the new value?',
   },
   ]).then(async answers=>{
         await realmTasks.changeTask(user, answers).then(r=>{
            index.output('Task updated.', 'result');
            index.output(r, 'result');
            return;
         })
      })
}

exports.changeStatus = async(user)=>{
   index.output('Update Task Status', 'header');
   return await inquirer.prompt([
   {
      type: 'input',
      name: 'id',
      message: 'What is the task ID (_id)?',
   },{
      type: 'rawlist',
      name: 'value',
      message: 'What is the new status?',
      choices: ['Open', 'In Progress', 'Closed'],
   }]).then(async answers=>{
      answers.key = 'status'
         await realmTasks.changeTask(user, answers).then(r=>{
            index.output('Task updated.', 'result');
            index.output(r, 'result');
            return;
         })
      })
}



    