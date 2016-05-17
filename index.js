var Promise = require('bluebird');
var npm = require('npm');

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

pnpm.install = function(pkgs, where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];

  return npmLoadConfig()
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
        npm.commands.install(where, pkgs, node_cb);
      })
    });
}

pnpm.uninstall = function(pkgs, abs_where) {
  if(pkgs.constructor.name === 'String') pkgs = [pkgs];
  if(abs_where) {
    var configs = {
      localPrefix: abs_where,
      prefix: abs_where
    }
  }
  return npmLoadConfig(configs)
    .then(function() {
      return Promise.fromCallback(function(node_cb) {
        npm.commands.uninstall(pkgs, node_cb);
      })
    });
}
