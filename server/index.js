var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var prompt = require('prompt');
var cmd = require('node-command-line'),
  Promise = require('bluebird');
var colors = require('colors/safe');
prompt.message = colors.bgGreen(' ');
prompt.delimiter = colors.green(' ');
const ora = require('ora');
const spinner = ora('Loading Data');
var promisify = require('node-promisify');
var obj_temp = {
  projectName: '',
  packages_data: '',
  count_LifeCycle_install_pkg: 0,
  scratch_org_alias: '',
  scratch_org_id: '',
  scratch_org_username: '',
};
// Configuration
const config = {
  login_URL_default: 'https://login.salesforce.com/',
  login_Alias_default: 'Prod',
};
// Function
function Head(value) {
  return colors.bgBlue(' ' + colors.white(colors.bold(value)) + ' ');
}
function error(value) {
  return colors.yellow(value);
}
function success(value) {
  return colors.green(value);
}
function convertToJson(value) {
  return JSON.stringify(value);
}
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json())
var port = 9000;
app.post('/SO', function(req, res) {
  console.log('receiving data...');
  console.log('body is ', req.body);
  function displayScratchOrg(value) {
    spinner.start('Loading..');
    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = 'Gathering data from server...';
    }, 1000);
    Promise.coroutine(function*() {
      //var response = yield cmd.run('sfdx force:org:display -u ' + obj_temp.scratch_org_alias);
      var response = yield cmd.run('npm -v');
      if (response.success) {
        spinner.stop();
        prompt.start();
        res.send(req.body);
        // prompt.get(
        //   [
        //     {
        //       name: 'install_packages',
        //       required: true,
        //       hidden: false,
        //       description: Head('Enter to install packages:'),
        //       default: 'yes',
        //     },
        //   ],
        //   function(err, result) {
        //     fs.readFile('config/configdata.json', 'utf8', function readFileCallback(err, data) {
        //       processInstallation_init(data);
        //     });
        //   }
        // );
      } else {
        console.log(error('Invalid Comment, Please contact administrator'));
        spinner.stop();
      }
    })();
  }
  function generatePassword(value) {
    spinner.start('Loading..');
    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = 'Generating password...';
    }, 1000);
    Promise.coroutine(function*() {
      //var response = yield cmd.run('sfdx force:user:password:generate -u ' + obj_temp.scratch_org_alias);
      var response = yield cmd.run('npm -v');
      if (response.success) {
        spinner.stop();
        spinner.succeed('Password generated successfully');
        prompt.start();
        displayScratchOrg(value);
      } else {
        console.log(error('Invalid Comment, Please contact administrator'));
        spinner.stop();
      }
    })();
  }
  function create_scratch_org(value, process) {
    spinner.start('Loading..');
    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = 'Creating scratch org...';
    }, 1000);
    obj_temp.scratch_org_alias = value;
    Promise.coroutine(function*() {
      //var response = yield cmd.run('sfdx force:org:create -f ' + obj_temp.projectName + '/config/project-scratch-def.json -a ' + value + ' -d 30');
      var response = yield cmd.run('npm -v');
      if (response.success) {
        spinner.succeed('Org created successfully');
        // var orgPattern = /00D[A-Za-z\d]{15}/;
        // var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
        // var orgPatternResolvedArray = orgPattern.exec(response.message);
        // var emailPatternResolvedArray = emailPattern.exec(response.message);
        // if (orgPatternResolvedArray && orgPatternResolvedArray.length > 0) {
        //   obj_temp.scratch_org_id = orgPatternResolvedArray[0];
        // }
        // if (emailPatternResolvedArray && emailPatternResolvedArray.length > 0) {
        //   obj_temp.scratch_org_username = emailPatternResolvedArray[0];
        // }
        // if (!obj_temp.scratch_org_id || !obj_temp.scratch_org_username) return;
        generatePassword(value);
      } else {
        console.log(error('Invalid Comment, Please contact administrator'));
        spinner.stop();
      }
    })();
  }
  function create_Project(value, process) {
    spinner.start('Loading..');
    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = 'Creating project...';
    }, 1000);
    Promise.coroutine(function*() {
      var response = yield cmd.run('sfdx force:project:create -n ' + value);
      if (response.success) {
        spinner.succeed('Project created successfully');
        fs.exists('./config/project-scratch-def.json', function(exists) {
          if (exists) {
            fs.readFile('./config/project-scratch-def.json', 'utf8', function readFileCallback(err, data) {
              fs.writeFile('./' + value + '/config/project-scratch-def.json', data, 'utf8', function readFileCallback(err, data) {
                spinner.succeed('Project created successfully');
                create_scratch_org(value);
              });
            });
          }
        });

      } else {
        console.log(error('Invalid Comment, Please contact administrator'));
        spinner.stop();
      }
    })();
  }
  function cmd_Exec(value, process) {
    spinner.start('Loading..');
    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = process;
    }, 1000);
    Promise.coroutine(function*() {
      var response = yield cmd.run(value);
      if (response.success) {
        spinner.stop();
        console.log(success('User LoggedIn successfully'));
        create_Project('GreatMan');
      //res.send(req.body);
      } else {
        console.log(error('Invalid Comment, Please contact administrator'));
        spinner.stop();
      }
    })();
  }
  //var _cmd_login = 'sfdx force:auth:web:login -r ' + 'https://eflang--staging.cs87.my.salesforce.com' + ' -d -a ' + 'Alias';
  var _cmd_login = 'npm -v';
  console.log("value:" + _cmd_login);
  cmd_Exec(_cmd_login, 'Waiting for loggin into salesforce..!');


});
// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);