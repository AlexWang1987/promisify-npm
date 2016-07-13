# promisify-npm
The library is mainly used to operate npm daily routines in your application.  perfect for making efficient tools.

# Usage
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
  .uninstall(['promisify-git','react'],'/something/folder/xx')
  .then(function(d) {
    console.log(d);
  })
  .catch(function(e) {
    console.log(e);
  })
```

# API
The param `pkgs` could be a  `string` or `array` which is supporting batch operations.

The param `where` is designed for specific purpose if you'd like to install packages as you want. default is `process.cwd`

* install(pkgs [,where])
* uninstall(pkgs [,where])
* hasInstalled(pkgs,[,where])
* initDefaultPkg([where],[packageJson])

coutinuing...

This library is under developing, All API might be changed for some reasons. So, be cautious using it.

# Good Library Companions
* [promisify-cli](https://www.npmjs.com/package/promisify-cli)
* [promisify-bash](https://www.npmjs.com/package/promisify-bash)
* [promisify-fs](https://www.npmjs.com/package/promisify-fs)
* [promsifiy-git](https://www.npmjs.com/package/promisify-git)
* [promsifiy-fetch](https://www.npmjs.com/package/promisify-fetch)
