/**
 * Created by karl on 11/2/17.
 */
'use strict';

const is = require('is');
const d64 = require('d64');

// use firebase friendly ( without .$[]#/ )
const fd64 = d64(',PYFGCRLAOEUIDHTNSQJKXBMWVZ_pyfgcrlaoeuidhtnsqjkxbmwvz1234567890'.split('').sort().join(''), d64);

function stringToByteArray(str) {
    let out = [], p = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        } else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        } else if (
            ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
            ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        } else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
}

function byteArrayToString(arr) {
    let out = [], pos = 0, c = 0;
    while (pos < arr.length) {
        let c1 = arr[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
            let c2 = arr[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
            // Surrogate Pair
            let c2 = arr[pos++];
            let c3 = arr[pos++];
            let c4 = arr[pos++];
            let u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
                0x10000;
            out[c++] = String.fromCharCode(0xD800 + (u >> 10));
            out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
        } else {
            let c2 = arr[pos++];
            let c3 = arr[pos++];
            out[c++] =
                String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
    }
    return out.join('');
}

function int32ToByteArray(int32) {
    return [(int32 & 0xff000000) >> 24, (int32 & 0x00ff0000) >> 16, (int32 & 0x0000ff00) >> 8, (int32 & 0x000000ff)];
}
function byteArrayToInt32(arr) {
    return (arr[0] << 24) + (arr[1] << 16) + (arr[2] << 8) + arr[3]
}

function encodeString(str) {
    return fd64.encode(stringToByteArray(str));
}
function decodeString(str64) {
    return byteArrayToString(fd64.decode(str64));
}

function encodeInt32(int32) {
    return fd64.encode(int32ToByteArray(int32));
}
function decodeInt32(str64) {
    return byteArrayToInt32(fd64.decode(str64));
}

function encodeScalar(value) {
    if (is.bool(value)) return 'b' + (value ? '1' : '0');
    if (is.number(value)) return 'n' + encodeInt32(value);
    return 's' + encodeString(value);
}
function decodeScalar(value) {
    const type = value[0];
    value = value.slice(1);
    if (type === 'b') return value === '1';
    if (type === 'n') return decodeInt32(value);
    return decodeString(value);
}

function encode(value) {
    if (is.array(value)) return 'a' + value.map(encodeScalar).join('~');
    return encodeScalar(value);
}
function decode(value) {
    if (value[0] === 'a') return value.slice(1).split('~').map(decodeScalar);
    return decodeScalar(value);
}

module.exports = {
    stringToByteArray,
    byteArrayToString,
    int32ToByteArray,
    byteArrayToInt32,
    encodeString,
    decodeString,
    encodeInt32,
    decodeInt32,
    encodeScalar,
    decodeScalar,
    encode,
    decode
};