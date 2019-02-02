const crypto = require('crypto')
const hexToBin = require('hex-to-binary')
const cryptoHash = (...inputs) => {
    args = inputs.sort().join(',')
    const hash = crypto.createHash('sha256')
    hash.update(inputs.sort().join(','))
    return (hash.digest('hex'))
}

module.exports = cryptoHash