const crypto = require('crypto')
const secret = 'NeiXuan_06_07_23'
const algorithm = 'aes_128_cbc'
const key = Buffer.from(secret, 'utf-8')
const iv = key

function encode(id) {
    const encoder = crypto.createCipheriv(algorithm, key, iv)
    const str = [id, Date.now(), 'NeiXuan06'].join('|')
    let encrypted = encoder.update(str, 'utf8', 'hex')
    encrypted += encoder.final('hex')
    return encrypted
}

function decode(id) {
    const decoder = crypto.createDecipheriv(algorithm, key, iv)
    let decode = decoder.update(str, 'hex', 'utf8')
    decode += decoder.final('utf-8')
    const arr = decode.split('|')
    return {
        id: arr[0],
        timespan: parseInt(arr[1])
    }
}

function encodeErCode() {
    return encode(Math.random())
}

module.exports = {
    encode,
    decode,
    encodeErCode
}