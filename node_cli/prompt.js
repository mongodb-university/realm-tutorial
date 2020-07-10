var EventEmitter = require('events');
var realmAuth = require('./realm/realmAuth');
var prompt = new EventEmitter();
var current = null;
var user = {};

process.stdin.resume();

process.stdin.on('data', function(data){
  prompt.emit(current, data.toString().trim());
});

prompt.on(':new', function(name, question){
  current = name;
  console.log(question);
  process.stdout.write('Realm ▷ ');
});

prompt.on(':end', function(){
  //TODO: log out
  console.log('\n Goodbye!');
  process.stdin.pause();
});

prompt.on('email', function(data) {
  user.email = data;
  prompt.emit(':new', 'password', 'Password:');
});



prompt.on('password', async function(data) {
  user.password = data;

  console.log('Logging in now...please hold')
    //TODO: login here!
  await realmAuth.login(user.email, user.password).then(result => {
    console.log(result);
  })
  prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});


prompt.on('tasks', function() {
  console.log('So you want to see some tasks, eh?');
  //TODO: get all tasks
});


prompt.on('createTask', function() {
  console.log('Let\'s create a new task.');
  prompt.emit(':new', 'taskName', 'What is the name of the task?');
});

prompt.on('taskName', function() {
  //TODO: use inquiry here
  prompt.emit(':new', 'taskStatus', 'What is the status of the task?');
});

prompt.on('taskStatus', function() {
  //TODO: create new task
  let newTask = {};
  console.log('new task created!', newTask);
  //prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
});




prompt.on('command', function(data) {
  switch (data.toLowerCase()){
    
    case 't':
    case 'tasks':
      prompt.emit(':new', 'tasks');
      break;
    case 'c':
    case 'create':
      prompt.emit(':new', 'createTask')
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
      '(c)reate: create a new task\n'+
      '(d)elete: delete a task\n'+
      '(m)odify: modify a task\n'+
      '(l)ogout/(q)uit: end the fun.\n'
      );
      //prompt.emit(':new', 'command', 'What would you like to do (‘help’ or ‘h’ for list of commands)?');
      break;
  }
});

// Program Entry Here
prompt.emit(':new', 'email', 'Welcome! Please login to continue.\nEmail:');


