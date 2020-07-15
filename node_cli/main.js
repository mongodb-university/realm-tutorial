const inquirer = require('inquirer');
const tasks = require('./tasks');
const { logout } = require('./realm/realmAuth');
const index = require('./index');

async function mainMenu(authedUser) {
   inquirer.prompt({
      type: 'rawlist',
      name: 'mainMenu',
      message: "What would you like to do?",
      choices: [ 'Create a task', 
               'Show all of my tasks', 
               'Get a specific task',
               'Change a task status',
               'Edit a task',
               'Delete a task',
               'Watch for changes',
               'Log out / Quit' ]})
   .then(async answers => {
      switch (answers.mainMenu) {
      case 'Create a task':
         await tasks.createTask(authedUser).then(()=>{
            mainMenu(authedUser);
         });
         break;
      case 'Show all of my tasks':
         await tasks.getTasks(authedUser).then(()=>{
            mainMenu(authedUser);
         });
         break;
      case 'Get a specific task':
         await tasks.getTask(authedUser).then(() =>{
            mainMenu(authedUser);
         });
         break;
      case 'Change a task status':
         await tasks.changeStatus(authedUser).then(() =>{
            mainMenu(authedUser);
         });
      break;  
      case 'Edit a task':
         await tasks.editTask(authedUser).then(() =>{
            mainMenu(authedUser);
         });
      break;
      case 'Delete a task':
         await tasks.deleteTask(authedUser).then(() =>{
            mainMenu(authedUser);
         });
      break;
      case 'Watch for changes':
         //TODO
      break;
      case 'Log out / Quit':
         await logout().then(l=>{
            if (!l) index.output('error logging out', 'error');
            else index.output('You have been logged out. Ctrl-C to quit', 'result');
            return;
         })
         break;
      default:
         mainMenu(authedUser);
         break; 
   }}).catch(err=>{
      index.output(err, "error");
      return;
   });
}

exports.mainMenu = mainMenu;