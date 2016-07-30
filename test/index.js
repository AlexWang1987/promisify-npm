var npm = require('../index.js');
var path = require('path');

npm
  .getLatestTag('shelljs')
  .then(function (d) {
    console.log('data->', d);
  })
  .catch(function (e) {
    console.error('catch->', e);
  })

// npm
//   .hasInstalled(['promisify-git','promisify-fs','bluebird'],'/Users/AlexWang/xx')
//   .then(function(d) {
//     console.log(d);
//   }).catch(function(e) {
//     console.log(e);
//   })

// npm
//   .initDefaultPkg()
//   .then(function (d) {
//     console.log(d);
//   })

