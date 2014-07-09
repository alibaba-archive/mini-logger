var Logger = require('./');

var logger = Logger({
  dir: __dirname + '/logs',
  stdout: true,
  mkdir: true
});

logger.error(new Error('test'));

// 2014-07-09 09:48:36.951 nodejs.ErrorException: Error: test
//     at Object.<anonymous> (/Users/deadhorse/git/mini-logger/example.js:9:14)
//     at Module._compile (module.js:449:26)
//     at Object.Module._extensions..js (module.js:467:10)
//     at Module.load (module.js:349:32)
//     at Function.Module._load (module.js:305:12)
//     at Function.Module.runMain (module.js:490:10)
//     at startup (node.js:124:16)
//     at node.js:803:3
// pid: 21588
// domainThrown: false
// Host: dead-horsedeMacBook-Pro.local
// URL:
// Data: ""
// 2014-07-09 09:48:36.951
