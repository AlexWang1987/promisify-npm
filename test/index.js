var npm = require('../index.js');

npm
  .uninstall('promisify-bash',__dirname)
  .then(function(d) {
    console.log('1->',d);
  })
  .catch(function(e) {
    console.log('2->',e);
  })

  // npm
  //   .hasInstalled(['promisify-git','promisify-fs'],'/Users/xxx/xx')
  //   .then(function(d) {
  //     console.log(d);
  //   }).catch(function(e) {
  //     console.log(e);
  //   })

// npm
//   .initDefaultPkg()
//   .then(function(d) {
//     console.log(d ,'-----<>---');
//   })
