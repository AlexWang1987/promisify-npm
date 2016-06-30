var npm = require('../index.js');

// npm
//   .hasInstalled(['promisify-fetch','promisify-bash'],'/Users/AlexWang/xx')
//   .then(function(d) {
//     console.log(d);
//   })
//   .catch(function(e) {
//     console.error('catch->', e);
//   })

// npm
//   .hasInstalled(['promisify-git','promisify-fs','bluebird'],'/Users/AlexWang/xx')
//   .then(function(d) {
//     console.log(d);
//   }).catch(function(e) {
//     console.log(e);
//   })

npm
  .initDefaultPkg(null, {
    description: 'create by alex'
  })
  .then(function (d) {
    console.log(d);
  })

