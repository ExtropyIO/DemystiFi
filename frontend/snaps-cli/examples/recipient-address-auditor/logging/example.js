const { theLog } = require('./winston.js');
const log = new theLog(__filename);

function main() {
  log.info('This is some info');
  log.warn('This is a warning');
  log.error('This is an error');
}

main();
