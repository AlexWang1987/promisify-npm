# promisify-npm
The library is mainly used to operate npm daily routines in your application.  perfect for making efficient tools.

#Usage
```javascript
var npm = require('promisify-npm');

npm
  .getPkgInfo('react')
  .then(function(d) {
    console.log(d.name,
    d.version,
    d.description);
  })
  .catch(function(e) {
    console.log('exits');
  })

npm
  .install('promisify-git')
  .then(function(d) {
    console.log(d,'sdfdsfdscu');
  })
  .catch(function(e) {
    console.log(e);
  })

npm
  .uninstall(['promisify-git','react'],'/something/folder/xx')
  .then(function(d) {
    console.log(d);
  })
  .catch(function(e) {
    console.log(e);
  })
```

#API

* getPkgInfo(pkg_name)
* install(pkgs [,where]) pkgs could be a string or array
* uninstall(pkgs [,where]) pkgs could be a string or array

coutinuing...
