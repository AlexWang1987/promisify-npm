var npm = require('../index.js');

npm
  .hasInstall('promisify-git','/Users/AlexWang/xx')
  .then(function(d) {
    console.log(d.name,
    d.version,
    d.description);
  })
  .catch(function(e) {
    console.log('exits');
  })

// npm
//   .initDefaultPkg()
//   .then(function(d) {
//     console.log(d ,'-----<>---');
//   })
