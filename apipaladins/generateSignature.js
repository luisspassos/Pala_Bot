const api = require('./api.js')

module.exports = function generateSignature(method) {
    return api.md5(`${api.devId}${method}${api.apiKey}${api.moment.utc().format('YYYYMMDDHHmmss')}`);
  };