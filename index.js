var Promise = require('bluebird');
var fs = require('promisify-fs');
var npm = require('npm');
var path = require('path');

/**
 * expose interface
 */
var pnpm = module.exports = {};

pnpm.npmLoadConfig = function(config) {
  return Promise.fromCallback(function(node_cb) {
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
pnpm.initDefaultPkg = function(abs_where, options) {
  //custom my own default package file
  if(abs_where) {
    var pkg_path = path.resolve(abs_where, 'package.json');

    //default settings
    var abs_where = path.resolve(abs_where);
    var pkg_name = abs_where.slice(abs_where.lastIndexOf('/') + 1);

    //name is required for all npm packages
    if(options && !options['name']) options['name'] = pkg_name;

    return fs.fileExists(pkg_path)
      .then(function(file_stat) {
        //pkg doest not exits.
        if(!file_stat) {
          return fs.writeFile(pkg_path, options || {
            name: pkg_name,
            description: "This is a default package.json created by wbp",
            version: "1.0.0",
            repository: {},
            license: "MIT"
          }, {
            space: '  ' //2 prettier spaces
          })
        }
      })
  } else {
    //default npm init behavior
    return pnpm.npmLoadConfig({
        yes: true
      })
      .then(function() {
        return Promise.fromCallback(function(node_cb) {
          //load package info from registry
          npm.commands.init(node_cb);
        })
      })
  }
}

/**
 * to get package's info from the registry
 * @param  {string} pkg_name package's name
 * @return {promise}          package info as JSON object
 */
pnpm.getPkgInfo = function(pkg_name) {
  return pnpm.npmLoadConfig()
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
        if(!pkg_name) return new Error('pkg_name is undefined');

        //load package info from registry
        npm.commands.view([pkg_name], true, node_cb);
      })
    })
    .then(function(kvInfo) {
      return kvInfo[Object.keys(kvInfo)[0]]
    })
}

/**
 * to install packages at current directory or particular place
 * @param  {string/array} pkgs      single or multiple packages
 * @param  {path} abs_where  it is a optional
 * @return {promise}
 */
pnpm.install = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];

  return Promise.try(function() {
      if(abs_where) {
        return fs
          .folderExists(abs_where)
          .then(function(stat) {
            if(!stat) {
              return fs.addFolder(abs_where)
                .then(function() {
                  return pnpm.initDefaultPkg(abs_where)
                })
            }
          })
      }
    })
    .then(function() {
      return pnpm.npmLoadConfig()
    })
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
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
pnpm.uninstall = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];
  var configs = {};

  if(abs_where) {
    configs.localPrefix = abs_where;
    configs.prefix = abs_where;
  }

  return pnpm.npmLoadConfig(configs)
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
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
pnpm.hasInstalled = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];
  var configs = {
    depth: 0
  }

  if(abs_where) {
    configs.localPrefix = abs_where;
    configs.prefix = abs_where;
  }

  return pnpm.npmLoadConfig(configs)
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
          npm.commands.list(pkgs, true, node_cb);
        })
        .get('dependencies')
        .then(function(deps) {
          var targetPkgs = Object.keys(deps);
          return pkgs.reduce(function(last, pkg) {
            return last && !!~targetPkgs.indexOf(pkg)
          }, true)
        })
    });
}
