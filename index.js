/*eslint-disable*/
var Promise = require('bluebird');
var fs = require('promisify-fs');
var bash = require('promisify-bash');
var npm = require('npm');
var path = require('path');

/**
 * bash npm
 * @method bnpm
 * @param  {[type]} args [description]
 * @return {[type]}
 */
var bnpm = function (args, options) {
  return bash('npm ' + args, options);
}

/**
 * expose interface
 */
var pnpm = module.exports = {};

/**
 * init a package
 * @param  {string} abs_where absolute path
 * @param  {object} options   package info settings
 * @return {promise}           promise
 */
pnpm.initDefaultPkg = function (abs_where, package_json) {
  var cwd = abs_where || process.cwd();
  var package_path = cwd + '/package.json';
  return fs
    .folderExists(cwd)
    .then(function (file_state) {
      if (!file_state) {
        return fs.addFolder(cwd);
      }
    })
    .then(function () {
      //folder but start with . hidden folder
      var folderName = path.parse(cwd).name;
      var isHiddenFolder = folderName.substr(0, 1) === '.';
      if (isHiddenFolder) {
        return fs.writeFile(package_path, {
          name: folderName.substr(1),
          description: 'This folder is created by promisify-npm.'
        }, {
          space: '  '
        })
      } else {
        return bnpm('init -y', {
          cwd: cwd
        })
      }
    })
    //customize package info
    .then(function () {
      if (package_json) {
        return fs
          .readJSON(package_path)
          .then(function (origin_json) {
            return fs.writeFile(package_path, Object.assign({}, origin_json, package_json), {
              space: '  '
            });
          })
      }
    })
}

/**
 * to install packages at current directory or particular place
 * @param  {string} pkg      single
 * @param  {path} abs_where  it is a optional
 * @return {promise}
 */
pnpm.install = function (pkg, abs_where) {
  var cwd = abs_where || process.cwd();
  return bnpm('install ' + pkg + '-S', {
    cwd: cwd
  });
}

/**
 * uninstall packages from current directory(default) or some where
 * @param  {string/array} pkgs     packages you want to remove
 * @param  {place}      abs_where which is optional
 * @return {promise}
 */
pnpm.uninstall = function (pkgs, abs_where) {
  var cwd = abs_where || process.cwd();
  return bnpm('uninstall ' + pkg + '-S', {
    cwd: cwd
  });
}

/**
 * where it has install all packages
 * @param  {string/array}  pkgs      packages
 * @param  {string}  abs_where the place to test
 * @return {promise}           promise/true/false
 */
pnpm.hasInstalled = function (pkg, abs_where) {
  var package_abs_path = (abs_where || process.cwd()) + '/package.json';
  return fs
    .readFile(package_abs_path)
    .then(JSON.parse)
    .get('dependencies')
    .then(function (deps) {
      return Boolean(deps && deps[pkg]);
    })
}

