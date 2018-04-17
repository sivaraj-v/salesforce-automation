const express = require('express');
const app = express();
const port = 9000;
var server = app.listen(port);
var io = require('socket.io').listen(server);
const http = require('http')
const socketIO = require('socket.io')
const bodyParser = require('body-parser');
const fs = require('fs');
const prompt = require('prompt');
const cmd = require('node-command-line'),
  Promise = require('bluebird');
const colors = require('colors/safe');
prompt.message = colors.bgGreen(' ');
prompt.delimiter = colors.green(' ');
const ora = require('ora');
const spinner = ora('Loading Data');
const promisify = require('node-promisify');
var moment = require('moment');
var socket_message = "🤝 Connection Success";
io.on('connection', socket => {
  const obj_temp = {
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
  // Add headers
  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });


  app.post('/SO', function(req, res) {
    console.log('receiving data...');
    console.log('body is ', req.body);
    obj_temp.scratch_org_alias = req.body.alias;
    obj_temp.projectName = req.body.projectName;
    function responseEmit(params) {
      socket_message = "😀 Copy your SO Details 🌟"
      socket.emit('so_creation', moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + " => " + socket_message);
      res.send(req.body);
    }
    function displayScratchOrg(value) {
      socket_message = "🆕 Displaying SO Details 🌟"
      spinner.start('Loading..');
      Promise.coroutine(function*() {
        //const response = yield cmd.run('sfdx force:org:display -u ' + obj_temp.scratch_org_alias);
        const response = yield cmd.run('npm -v');
        if (response.success) {

          prompt.start();
          socket_message = "😀 Copy your SO Details 🌟"
          responseEmit()
          spinner.stop();
        } else {
          socket_message = "👺 Someting went wrong contact admin 👀";
          console.log(error('Invalid Comment, Please contact administrator'));
          spinner.stop();
        }
      })();
    }
    function generatePassword(value) {
      socket_message = "🏋️‍ Genrating password... 📢";
      spinner.start('Loading..');
      setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'Generating password...';
        socket_message = "🏋️‍ Please wait... Generating password 📢";
      }, 1000);
      Promise.coroutine(function*() {
        //const response = yield cmd.run('sfdx force:user:password:generate -u ' + obj_temp.scratch_org_alias);
        const response = yield cmd.run('npm -v');
        if (response.success) {
          spinner.stop();
          spinner.succeed('Password generated successfully');
          socket_message = "Password generated successfully ✔️";
          prompt.start();
          displayScratchOrg(value);
        } else {
          socket_message = "👺 Someting went wrong contact admin 👀";
          console.log(error('Invalid Comment, Please contact administrator'));
          spinner.stop();
        }
      })();
    }
    function create_scratch_org(value, process) {
      socket_message = "👨🏻‍💻 Creating SO for " + obj_temp.scratch_org_alias;
      spinner.start('Loading..');
      setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'Creating scratch org...';
        socket_message = "Please wait... 🕑 creating SO for " + obj_temp.scratch_org_alias;
      }, 1000);
      obj_temp.scratch_org_alias = value;
      Promise.coroutine(function*() {
        //const response = yield cmd.run('sfdx force:org:create -f ' + obj_temp.projectName + '/config/project-scratch-def.json -a ' + value + ' -d 30');
        const response = yield cmd.run('npm -v');
        if (response.success) {
          spinner.succeed('Org created successfully');
          socket_message = "SO successfully ⛳️ created for " + obj_temp.scratch_org_alias;
          // const orgPattern = /00D[A-Za-z\d]{15}/;
          // const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
          // const orgPatternResolvedArray = orgPattern.exec(response.message);
          // const emailPatternResolvedArray = emailPattern.exec(response.message);
          // if (orgPatternResolvedArray && orgPatternResolvedArray.length > 0) {
          //   obj_temp.scratch_org_id = orgPatternResolvedArray[0];
          // }
          // if (emailPatternResolvedArray && emailPatternResolvedArray.length > 0) {
          //   obj_temp.scratch_org_username = emailPatternResolvedArray[0];
          // }
          // if (!obj_temp.scratch_org_id || !obj_temp.scratch_org_username) return;
          generatePassword(obj_temp.scratch_org_alias);
        } else {
          socket_message = "👺 Someting went wrong contact admin 👀";
          console.log(error('Invalid Comment, Please contact administrator'));
          spinner.stop();
        }
      })();
    }
    function create_Project(value, process) {
      socket_message = "📁 Creating project...🕔 ";
      spinner.start('Loading..');
      setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'Creating project...';
        socket_message = "📁 Creating project...🕣 ";
      }, 1000);
      Promise.coroutine(function*() {
        const response = yield cmd.run('sfdx force:project:create -n ' + value);
        if (response.success) {
          spinner.succeed('Project created successfully');
          fs.exists('./config/project-scratch-def.json', function(exists) {
            if (exists) {
              fs.readFile('./config/project-scratch-def.json', 'utf8', function readFileCallback(err, data) {
                fs.writeFile('./' + value + '/config/project-scratch-def.json', data, 'utf8', function readFileCallback(err, data) {
                  spinner.succeed('Project created successfully');
                  socket_message = " 📩 Project Successfully Created ⛳️ ";
                  create_scratch_org(obj_temp.scratch_org_alias);
                });
              });
            }
          });

        } else {
          socket_message = "👺 Someting went wrong contact admin 👀";
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
        const response = yield cmd.run(value);
        if (response.success) {
          spinner.stop();
          console.log(success('User LoggedIn successfully'));
          console.log(obj_temp.projectName);
          create_Project(obj_temp.projectName);
          socket_message = "User LoggedIn successfully 🤙";

        } else {
          socket_message = "👺 Someting went wrong contact admin 👀";
          console.log(error('Invalid Comment, Please contact administrator'));
          spinner.stop();
        }
      })();
    }
    //const _cmd_login = 'sfdx force:auth:web:login -r ' + 'https://eflang--staging.cs87.my.salesforce.com' + ' -d -a ' + 'Alias';
    const _cmd_login = 'npm -v';
    console.log("value:" + _cmd_login);
    cmd_Exec(_cmd_login, 'Waiting for loggin into salesforce..!');
  });
  setInterval(function() {
    socket.emit('so_creation', moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + " => " + socket_message);
  }, 1000);
})
console.log('Server started! At http://localhost:' + port);