const api = require('../apipaladins/api')

function generateSignature(method) {
    return api.md5(`${api.devId}${method}${api.apiKey}${api.moment.utc().format('YYYYMMDDHHmmss')}`)

}

exports.requests = (method, variavel, sessao) => {
    return api.axios(`${api.endPoint}${method}Json/${api.devId}/${generateSignature(method)}/${sessao}/${api.moment.utc().format('YYYYMMDDHHmmss')}/${variavel}`)
}

exports.sessionIID = () => {
    return api.axios(`${api.endPoint}createsessionJson/${api.devId}/${generateSignature("createsession")}/${api.moment.utc().format('YYYYMMDDHHmmss')}`)
}