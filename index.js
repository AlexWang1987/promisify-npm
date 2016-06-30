/*eslint-disable*/
var Promise = require('bluebird');
var fs = require('promisify-fs');
var npm = require('npm');
var path = require('path');

/**
 * expose interface
 */
var pnpm = module.exports = {};

/**
 * init npm before using it.
 * @return promise
 */
pnpm.npmInit = function (config) {
  return Promise.fromCallback(function (node_cb) {
    //default config
    var defaultConf = config || {};

    //debuggable
    defaultConf['loglevel'] = defaultConf['loglevel'] || 'info';
    defaultConf['save'] = defaultConf['save'] || true;
    defaultConf['savePrefix'] = defaultConf['savePrefix'] || '~';

    //Loading Config Files
    npm.load(defaultConf, node_cb);
  })
}

/**
 * init a package
 * @param  {string} abs_where absolute path
 * @param  {object} options   package info settings
 * @return {promise}           promise
 */
pnpm.initDefaultPkg = function (abs_where, package_json) {
  var package_abs_path = (abs_where || process.cwd()) + '/package.json';
  var prefix = path.dirname(package_abs_path);
  return fs
    .fileExists(package_abs_path)
    .then(function (file_stat) {
      if (!file_stat) {
        return pnpm.npmInit({
            yes: true,
            localPrefix: prefix,
            prefix: prefix
          })
          .then(function () {
            return Promise.fromCallback(function (node_cb) {
              npm.commands.init(node_cb);
            })
          })
          .then(function (init_package_json) {
            return package_json ?
              fs.writeFile(package_abs_path, Object.assign({}, init_package_json, package_json), {
                space: '  '
              }) :
              init_package_json
          })
      }
      console.log(package_abs_path + ' exists, It will ignore.');
    })
}

/**
 * to install packages at current directory or particular place
 * @param  {string/array} pkgs      single or multiple packages
 * @param  {path} abs_where  it is a optional
 * @return {promise}
 */
pnpm.install = function (pkgs, abs_where) {
  if (pkgs.constructor.name === 'String') pkgs = [pkgs];

  return Promise.try(function () {
      if (abs_where) {
        return fs
          .folderExists(abs_where)
          .then(function (stat) {
            if (!stat) {
              return fs.addFolder(abs_where)
                .then(function () {
                  return pnpm.initDefaultPkg(abs_where)
                })
            }
          })
      }
    })
    .then(function () {
      return pnpm.npmInit()
    })
    .then(function () {
      return Promise.fromCallback(function (node_cb) {
        npm.commands.install(abs_where, pkgs, node_cb);
      })
    });
}

/**
 * uninstall packages from current directory(default) or some where
 * @param  {string/array} pkgs     packages you want to remove
 * @param  {place}      abs_where which is optional
 * @return {promise}
 */
pnpm.uninstall = function (pkgs, abs_where) {
  if (pkgs.constructor.name === 'String') pkgs = [pkgs];
  var configs = {};

  if (abs_where) {
    configs.localPrefix = abs_where;
    configs.prefix = abs_where;
  }

  return pnpm.npmInit(configs)
    .then(function () {
      return Promise.fromCallback(function (node_cb) {
        npm.commands.uninstall(pkgs, node_cb);
      })
    });
}

/**
 * where it has install all packages
 * @param  {string/array}  pkgs      packages
 * @param  {string}  abs_where the place to test
 * @return {promise}           promise/true/false
 */
pnpm.hasInstalled = function (pkgs, abs_where) {
  if (pkgs.constructor.name === 'String') pkgs = [pkgs];
  var package_abs_path = (abs_where || process.cwd()) + '/package.json';
  return fs.fileExists(package_abs_path)
    .then(function (file_stat) {
      if (file_stat) {
        return fs
          .readFile(package_abs_path)
          .then(JSON.parse)
          .get('dependencies')
          .then(function (deps) {
            if (deps) {
              var targetPkgs = Object.keys(deps);
              return pkgs.reduce(function (last, pkg) {
                return last && !!~targetPkgs.indexOf(pkg)
              }, true)
            }
          })
      }
    })
}

/**
 * to get package's info from the registry
 * @param  {string} pkg_name package's name
 * @return {promise}          package info as JSON object
 */
pnpm.getPkgInfo = function (pkg_name) {
  return pnpm.npmInit()
    .then(function () {
      return Promise.fromCallback(function (node_cb) {
        if (!pkg_name) return new Error('pkg_name is undefined');

        //load package info from registry
        npm.commands.view([pkg_name], true, node_cb);
      })
    })
    .then(function (kvInfo) {
      return kvInfo[Object.keys(kvInfo)[0]]
    })
}

