let jwt = require('jsonwebtoken')

module.exports.issueToken = (secret, payload) => {
    return jwt.sign(payload, secret)
}
