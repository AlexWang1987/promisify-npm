var npm = require('../index.js');

// npm
//   .install('promisify-git','/Users/AlexWang/xx')
//   .then(function(d) {
//     console.log(d);
//   })
//   .catch(function(e) {
//     console.log('exits');
//   })


  npm
    .hasInstalled(['promisify-git','promisify-fs'],'/Users/xxx/xx')
    .then(function(d) {
      console.log(d);
    }).catch(function(e) {
      console.log(e);
    })

// npm
//   .initDefaultPkg()
//   .then(function(d) {
//     console.log(d ,'-----<>---');
//   })
