var realmAuth = require('./realm/realmAuth');
var main = require('./main');
const inquirer = require('inquirer');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

let authedUser;
let output = (text, type)=>{
   if (type == 'result') console.log(chalk.cyanBright(text));
   if (type == 'header') console.log(chalk.cyanBright.bold('\n' + text + '\n'));
   if (type == 'error') console.log(chalk.red.bold('\n ❗' + text + ' ❗\n'));
}

clear();
console.log(
   chalk.green.bold(
      figlet.textSync('realm-cli', { 
         font: 'colossal',
      })
   )
);

function run() {
   output('*** WELCOME ***', 'header');
   output('Please log in to your Realm account:', 'header');
   inquirer.prompt([
      {
         type: 'input',
         name: 'email',
         message: 'Email:',
      },{
         type: 'password',
         name: 'password',
         message: 'Password:',
         mask: '*'
      }]).then(input=>{
         realmAuth.login(input.email, input.password)
            .then(result => {
               authedUser = result;
               if (!authedUser.isLoggedIn) {
                  output('Something went wrong logging you in.', 'error')
                  return;
               }
               output('You have successfully logged in.', 'result');
               return main.mainMenu(authedUser).then(
                  console.log('here?')
               );
         });
   }).catch(err=>{
      console.log(err);
   });
}

run();
exports.output = output;