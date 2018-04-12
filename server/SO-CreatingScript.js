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

function displayScratchOrg(value) {
  spinner.start('Loading..');
  setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Gathering data from server...';
  }, 1000);
  Promise.coroutine(function*() {
    var response = yield cmd.run('sfdx force:org:display -u ' + obj_temp.scratch_org_alias);
    if (response.success) {
      spinner.stop();
      prompt.start();
      prompt.get(
        [
          {
            name: 'install_packages',
            required: true,
            hidden: false,
            description: Head('Enter to install packages:'),
            default: 'yes',
          },
        ],
        function(err, result) {
          fs.readFile('config/configdata.json', 'utf8', function readFileCallback(err, data) {
            processInstallation_init(data);
          });
        }
      );
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
    var response = yield cmd.run('sfdx force:user:password:generate -u ' + obj_temp.scratch_org_alias);
    if (response.success) {
      spinner.stop();
      spinner.succeed('Password generated successfully');
      prompt.start();
      prompt.get(
        [
          {
            name: 'displayScratchOrg',
            required: true,
            description: Head('Press enter to view scratch org:'),
            default: 'yes',
          },
        ],
        function(err, result) {
          displayScratchOrg(result.projectName);
        }
      );
    } else {
      console.log(error('Invalid Comment, Please contact administrator'));
      spinner.stop();
    }
  })();
}
function for_increment_install(i) {
  processInstallation_emit(i + 1);
}
function processInstallation_emit(i) {
  if (obj_temp.count_LifeCycle_install_pkg > i) {
    var val_frm_pkg_json = {
      name: obj_temp.packages_data[i].package_name,
      ver_id: obj_temp.packages_data[i].package_version,
      key: obj_temp.packages_data[i].package_key,
    };
    Promise.coroutine(function*() {
      var command = '';
      if (val_frm_pkg_json.key) {
        command = 'sfdx force:package:install -i ' + val_frm_pkg_json.ver_id + ' -k ' + val_frm_pkg_json.key + ' -u ' + obj_temp.scratch_org_alias;
      } else {
        command = 'sfdx force:package:install -i ' + val_frm_pkg_json.ver_id + ' -u ' + obj_temp.scratch_org_alias;
      }
      var response = yield cmd.run(command);
      spinner.start('Loading..');
      setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'Installation begins...';
      }, 1000);
      if (response.success) {
        console.log(response);
        var packageStatusCheckPattern = /sfdx\sforce:package:install:get\s-i\s[A-Za-z\d]{18}\s-u\s[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
        var packageStatusCheckPatternResolvedArray = packageStatusCheckPattern.exec(response.message);
        if (packageStatusCheckPatternResolvedArray && packageStatusCheckPatternResolvedArray.length > 0) {
          var installationStatusCheckCommand = packageStatusCheckPatternResolvedArray[0];
        }
        if (!installationStatusCheckCommand) {
          return;
        }
        var checkInstallationStatus = setInterval(function() {
          //console.log('installation status->>');
          spinner.stop();
          spinner.start('Package install requested..');
          console.log(installationStatusCheckCommand);
          Promise.coroutine(function*() {
            spinner.stop();
            spinner.start('Loading...');
            var response = yield cmd.run(installationStatusCheckCommand);
            if (response.success) {
              //clearInterval(checkInstallationStatus)
              var installationSuccessPattern = /Successfully\sinstalled\spackage\s\[/g;
              var installationSuccessResolvedArray = installationSuccessPattern.exec(response.message);
              if (installationSuccessResolvedArray && installationSuccessResolvedArray.length > 0) {
                spinner.stop();
                spinner.succeed(success(installationSuccessResolvedArray[0]));
                for_increment_install(i);
                clearInterval(checkInstallationStatus);
              }
              spinner.stop();
              spinner.start('Installation process in queue...');
            //console.log(response);
            } else {
              console.log(error('Package queue failed, Please contact administrator'));
              console.log(response);
            }
          })();
        }, 120000);
      } else {
        console.log(error('Package installation got failed'));
        spinner.stop();
      }
    })();
  } else {
    console.log(success('Package installation process completed'));
    spinner.stop();
    process.exit();
  }
}
function processInstallation_init(value) {
  obj_temp.packages_data = JSON.parse(value).Packages;
  obj_temp.count_LifeCycle_install_pkg = JSON.parse(value).Packages.length;
  if (obj_temp.count_LifeCycle_install_pkg > 0) processInstallation_emit(0);
  else console.log('No packages to install');
}
function create_scratch_org(value, process) {
  spinner.start('Loading..');
  setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Creating scratch org...';
  }, 1000);
  obj_temp.scratch_org_alias = value;
  Promise.coroutine(function*() {
    var response = yield cmd.run('sfdx force:org:create -f ' + obj_temp.projectName + '/config/project-scratch-def.json -a ' + value + ' -d 30');
    if (response.success) {
      spinner.succeed('Org created successfully');
      var orgPattern = /00D[A-Za-z\d]{15}/;
      var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
      var orgPatternResolvedArray = orgPattern.exec(response.message);
      var emailPatternResolvedArray = emailPattern.exec(response.message);

      if (orgPatternResolvedArray && orgPatternResolvedArray.length > 0) {
        obj_temp.scratch_org_id = orgPatternResolvedArray[0];
      }
      if (emailPatternResolvedArray && emailPatternResolvedArray.length > 0) {
        obj_temp.scratch_org_username = emailPatternResolvedArray[0];
      }
      if (!obj_temp.scratch_org_id || !obj_temp.scratch_org_username) return;
      prompt.start();
      prompt.get(
        [
          {
            name: 'generatePasswordEnter',
            required: true,
            description: Head('Press enter to generate password :'),
            default: 'yes',
          },
        ],
        function(err, result) {
          generatePassword();
        }
      );
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
      prompt.start();
      prompt.get(
        [
          {
            name: 'copy_def_file',
            required: true,
            hidden: false,
            description: Head('Enter to generate project-scratch-def.json'),
            default: 'yes',
          },
        ],
        function(err, result) {
          fs.exists('./config/project-scratch-def.json', function(exists) {
            if (exists) {
              fs.readFile('./config/project-scratch-def.json', 'utf8', function readFileCallback(err, data) {
                fs.writeFile('./' + obj_temp.projectName + '/config/project-scratch-def.json', data, 'utf8', function readFileCallback(err, data) {
                  spinner.succeed('Project-scratch-def.json generated successfully');

                  prompt.start();
                  prompt.get(
                    [
                      {
                        name: 'orgAlias',
                        required: true,
                        description: Head('Enter alias for org:'),
                      },
                    ],
                    function(err, result) {
                      create_scratch_org(result.orgAlias);
                    }
                  );
                });
              });
            }
          });
        }
      );
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
      console.log(success('Connection Success'));
      prompt.start();
      prompt.get(
        [
          {
            name: 'projectName',
            required: true,
            description: Head('Enter project name:'),
          },
        ],
        function(err, result) {
          obj_temp.projectName = result.projectName;
          create_Project(result.projectName);
        }
      );
    } else {
      console.log(error('Invalid Comment, Please contact administrator'));
      spinner.stop();
    }
  })();
}

// File Management
var result = {
  loginDetails: {
    login_URL: '',
    Alias: '',
  },
};
fs.exists('./config/dataCollection.json', function(exists) {
  if (exists) {
    fs.writeFile('./config/dataCollection.json', convertToJson(result), 'utf8', function readFileCallback(err, data) {});
  }
});
// Process Begins
var LoginURL = {
  properties: {
    loginURL: {
      pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
      message: error('Invalid URL, Enter valid URL'),
      required: true,
      description: Head('Enter Login URL:'),
      default: config.login_URL_default,
    },
  },
};
var Alias = {
  properties: {
    alias: {
      pattern: /^[A-z]+$/,
      message: error('Alias must be only letters'),
      required: true,
      description: Head('Enter Alias:'),
      default: config.login_Alias_default,
    },
  },
};
prompt.get([LoginURL, Alias], function(err, result) {
  var _cmd_login = 'sfdx force:auth:web:login -r ' + result.loginURL + ' -d -a ' + result.alias;
  cmd_Exec(_cmd_login, 'Waiting for loggin into salesforce..!');
});
prompt.start();
