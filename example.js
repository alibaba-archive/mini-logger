var Logger = require('./');

var logger = Logger({
  dir: __dirname + '/logs'
});

  logger.error(new Error('test'));
