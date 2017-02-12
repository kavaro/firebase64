/**
 * Created by karl on 11/2/17.
 */
'use strict';

const assert = require('assert');
const {encode, decode} = require('./index');

const sHello = encode('Hello');
assert.equal(sHello, 'sH5KgQ5w');
const sWorld = encode('World');
assert.equal(sWorld, 'sKqxmQ5F');
assert.deepEqual([sWorld, sHello].sort().map(decode), ['Hello', 'World']);

const nSmall = encode(100000);
assert.equal(nSmall, 'n,,55c,');
const nBig = encode(100016);
assert.equal(nBig, 'n,,55g,');
assert.deepEqual([nBig, nSmall].sort().map(decode), [100000, 100016]);

const bTrue = encode(true);
assert.equal(bTrue, 'b1');
assert.equal(decode(bTrue), true);
const bFalse = encode(false);
assert.equal(bFalse, 'b0');
assert.equal(decode(bFalse), false);

function multiFieldSort(low, high) {
    const encoded = [encode(high), encode(low)];
    assert.deepEqual(encoded.sort().map(decode), [low, high]);
}

multiFieldSort(['a', 0], ['a', 1]);
multiFieldSort(['a', 0], ['b', 0]);
multiFieldSort(['a', 1], ['aa', 0]);

multiFieldSort(['a', 'a'], ['a', 'b']);
multiFieldSort(['a', 'a'], ['b', 'a']);
multiFieldSort(['a', 'b'], ['aa', 'a']);

multiFieldSort(['a', false], ['a', true]);
multiFieldSort(['a', false], ['b', false]);
multiFieldSort(['a', true], ['aa', false]);
