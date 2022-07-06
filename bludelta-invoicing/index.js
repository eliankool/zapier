const authentication = require('./authentication');
const parseInvoiceCreate = require('./creates/parse_invoice.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  creates: { [parseInvoiceCreate.key]: parseInvoiceCreate },
};
