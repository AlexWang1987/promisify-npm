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
    console.log(e);
  })

npm
  .install('promisify-git')
  .then(function(pkg_infos) {
    console.log(pkg_infos);
  })
  .catch(function(e) {
    console.log(e);
  })

npm
  .unInstalled(['promisify-git','react'],'/something/folder/xx')
  .then(function(d) {
    console.log(d);
  })
  .catch(function(e) {
    console.log(e);
  })
```

#API
//pkgs could be a string or array

* getPkgInfo(pkg_name)
* install(pkgs [,where])
* uninstall(pkgs [,where])
* hasInstalled(pkgs,[,where])


coutinuing...
