const api = require('../apipaladins/api')
const generateSignature = require('../apipaladins/generateSignature')

module.exports = () => {
    return api.axios(`${api.endPoint}createsessionJson/${api.devId}/${generateSignature("createsession")}/${api.moment.utc().format('YYYYMMDDHHmmss')}`)
}