const crypto = require('crypto');
const secret = 'NeiXuan_06_07_23';
const algorithm = 'aes-128-cbc';
const key = Buffer.from(secret, 'utf8');
const iv = key;

function encode(id) {
    const encoder = crypto.createCipheriv(algorithm, key, iv)
    const str = [id, Date.now(), 'NeiXuan06'].join('|');
    let encrypted = encoder.update(str, 'utf8', 'hex');
    encrypted += encoder.final('hex');
    return encrypted;
}

function decode(str) {
    const decoder = crypto.createDecipheriv(algorithm, key, iv);
    let decoded = decoder.update(str, 'hex', 'utf8');
    decoded += decoder.final('utf8');
    const arr = decoded.split('|');
    return {
        id: arr[0],
        timespan: parseInt(arr[1])
    }
}

function encodeErCode() {
    return encode(Math.random());
}

module.exports = {
    encode,
    decode,
    encodeErCode
}