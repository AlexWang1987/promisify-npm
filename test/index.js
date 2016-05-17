var npm = require('../index.js');

/*
npm
  .getPkgInfo('reac1t')
  .then(function(d) {
    console.log(d.name,
    d.version,
    d.description);
  })
  .catch(function(e) {
    console.log('exits');
  })
*/



npm
  .install(['promisify-git'],'/Users/AlexWang/xx')
  .then(function(d) {
    console.log(d,'sdfdsfdscu');
  })
  .catch(function(e) {
    console.log(e);
  })
