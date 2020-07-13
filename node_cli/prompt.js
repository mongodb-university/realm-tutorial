var EventEmitter = require('events');
var realmAuth = require('./realm/realmAuth');
var realmTasks = require('./realm/realmTasks');

var prompt = new EventEmitter();
var current = null;
var user = {};
var authedUser;
let task = {};
var field;
var newValue;
let validStatus = ['open', 'in progress', 'closed'];

// START PROMPT LOGIC
process.stdin.resume();

process.stdin.on('data', function(data){
  prompt.emit(current, data.toString().trim());
});

prompt.on(':new', function(name, question, prompt){
  current = name;
  if (prompt == undefined) prompt = 'Realm'
  process.stdout.write(question + '\n' + prompt +' ▷ ');
});

prompt.on(':end', function(){
  let isLoggedOut = realmAuth.logout();
  if (isLoggedOut) console.log('You have been logged out of Realm.')
  console.log('\n Goodbye!');
  process.stdin.destroy();
  prompt.emit('stop');
  prompt.stopped = true;
  prompt.started = false;
  prompt.paused = false;
});

// END PROMPT LOGIC

// Logon
prompt.on('email', function(data) {
  user.email = data.toString().trim();
  prompt.emit(':new', 'password', ' ', 'Password:');
});

prompt.on('password', async function(data) {
  user.password = data;
  console.log('Logging in now...please hold on.')
  await realmAuth.login(user.email, user.password).then(result => {
    authedUser = result;
    console.log('Success!')
  });
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});

// Get all tasks
async function getTasks(){
  await realmTasks.getTasks(authedUser);
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
}

// Create new task
prompt.on('taskName', function(data) {
task.name = data;
  prompt.emit(':new', 'taskStatus', 'What is the status of the task?', 'Task status');
});

prompt.on('taskStatus', async function(data) {
  let status = data.toString().trim().toLowerCase();
  if (!validStatus.includes(status)){
    console.log('You must set the status to one of', validStatus)
    return prompt.emit(':new', 'taskStatus', 'What is the status of the task?', 'Task status');
  }
  task.status = data;
  let result = await realmTasks.createTask(authedUser, task.name, task.status);
  console.log('result', result);
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});

// Delete a task
prompt.on('delete', async function(data) {
  task._id = data.toString().trim();
  prompt.emit(':new', 'deleteConfirm', 'Are you sure?', 'Delete Task (y/N)');
});

prompt.on('deleteConfirm', async function(data) {
  if (data.toString().trim().toLowerCase() === 'y'){
    let result = await realmTasks.deleteTask(authedUser, task._id);
    if (result) console.log('Successfully deleted!');
  }
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});

// Get one task
prompt.on('get', async function(data) {
  let _id = data.toString().trim();
  console.log(_id);
  task = await realmTasks.getTask(authedUser, _id)
  console.log(JSON.stringify(task, null, 3))
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});

// Change a task
prompt.on('modify', async function(data) {
  task._id = data.toString().trim();
  console.log(task._id);
  task = await realmTasks.getTask(authedUser, task._id)
  console.log('This is the task you will modify:', JSON.stringify(task, null, 3));
  
  prompt.emit(':new', 'taskField', 'What field do you want to change?', 'Field name');
});

prompt.on('taskField', async function(data) {
  field = data.toString().trim();
  prompt.emit(':new', 'taskModify', 'What is the new value?', 'Value');
});

prompt.on('taskModify', async function(data) {
  newValue = data.toString().trim();
  if (field == 'status' && !validStatus.includes(status)){
    console.log('You must set the status to one of', validStatus)
    return prompt.emit(':new', 'taskModify', 'What is the new value?', 'Value');
  }
  let result = await realmTasks.changeTask(authedUser, task._id, field, newValue);
  if (result) console.log('Task updated successfully');
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});

prompt.on('command', async function(data) {
  switch (data.toLowerCase()){
    case 't':
    case 'tasks':
      this.current = 'getTasks';
      await getTasks();
      break;
    case 'c':
    case 'create':
      prompt.emit(':new', 'taskName', 'What is the name of the task?', 'Task name')
      break;
    case 'd':
    case 'delete':
        prompt.emit(':new', 'delete', 'What is the _id of the task you want to delete?', 'Task ID')
        break;
    case 'g':
    case 'get':
        prompt.emit(':new', 'get', 'What is the _id of the task you want to fetch?', 'Task ID')
        break;
    case 'm':
    case 'modify':
        prompt.emit(':new', 'modify', 'What is the _id of the task you want to change?', 'Task ID')
        break;
    case 'q':
    case 'quit':
      prompt.emit(':end');
      break;
    case 'h':
    case 'help':
    default:
      prompt.emit(':new', 'command', 
      '(h)elp: show this list\n'+
      '(t)asks: list all tasks\n'+
      '(g)et a task\n'+
      '(c)reate: create a new task\n'+
      '(d)elete: delete a task\n'+
      '(m)odify: modify a task\n'+
      '(q)uit: end the fun.\n'
      );
      break;
  }
});

// Program Entry Here
prompt.emit(':new', 'email', 'Welcome! Please login to continue.', 'Email');