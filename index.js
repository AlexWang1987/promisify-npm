var Promise = require('bluebird');
var fs = require('promisify-fs');
var npm = require('npm');
var path = require('path');

/**
 * expose interface
 */
var pnpm = module.exports = {};

var npmLoadConfig = function(config) {
  return Promise.fromCallback(function(node_cb) {
    //Loading Config Files
    npm.load(config, node_cb);
  })
}

pnpm.initDefaultPkg = function(abs_where, options) {
  //custom my own default package file
  if(abs_where) {
    var pkg_path = path.resolve(abs_where, 'package.json');

    //default settings
    var abs_where = path.resolve(abs_where);
    var pkg_name = abs_where.slice(abs_where.lastIndexOf('/') + 1);

    //name is required for all npm packages
    if(options && !options['name']) options['name'] = pkg_name;

    return fs.existsFile(pkg_path)
      .reflect()
      .call('isRejected')
      .then(function(isRejected) {
        //pkg file exits.
        if(isRejected) {
          return fs.writeFile(pkg_path, options || {
            name: pkg_name,
            description: "This is a default package.json created by wbp"
          }, {
            space: '  ' //2 prettier spaces
          })
        }

        return new Error('package file exits, ignore')
      })
  } else {
    //default npm init behavior
    return npmLoadConfig({
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

pnpm.getPkgInfo = function(pkg_name) {
  return npmLoadConfig()
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

pnpm.install = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];

  return npmLoadConfig({
      save: true
    })
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
        npm.commands.install(abs_where, pkgs, node_cb);
      })
    });
}

pnpm.unInstalled = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];
  var configs = {};

  if(abs_where) {
    configs.localPrefix = abs_where;
    configs.prefix = abs_where;
  }

  //save dependencies
  configs.save = true;

  return npmLoadConfig(configs)
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
        npm.commands.uninstall(pkgs, node_cb);
      })
    });
}

pnpm.hasInstalled = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];
  var configs = {
    depth: 0
  }

  if(abs_where) {
    configs.localPrefix = abs_where;
    configs.prefix = abs_where;
  }

  return npmLoadConfig(configs)
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
        npm.commands.list(pkgs, true, node_cb);
      })
      .get('dependencies')
      .then(function(deps) {
        var installPkgs = Object.keys(deps)
        var unInstallPkgs = pkgs.filter(function (pkg_name){
          return ! ~ installPkgs.indexOf(pkg_name)
        })
        if(unInstallPkgs.length){
          throw new Error('These package have not been installed yet -> ' + unInstallPkgs)
        }
      })
    });
}
