# Firebase64

Combines two closure library functions with the d64 module to encode/decode (array of) boolean, 32 bit integer, string to/from a ascii embeddable, lexicographic sortable value that can be used as firebase key.

The generated encoded strings can be used to create a firebase:
- (multi-)field filter index
- (multi-)field sort values

The implementation uses the following character set: ,PYFGCRLAOEUIDHTNSQJKXBMWVZ_pyfgcrlaoeuidhtnsqjkxbmwvz1234567890

Array items are separated by the character: ~

Example:
```
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
```

## Api

### encode(value: boolean|number|string|[boolean|number|string]) : string

Convert (array of) boolean or 32 bit integer or utf8 string to base64 string

### decode(value: string) : boolean|number|string|[boolean|number|string]

Convert encoded base64 string to (array of) boolean or 32 bit integer or utf8 string

### stringToByteArray(str: string) : array

Convert string to byte array

### byteArrayToString(arr: array): string

Convert array of bytes to string

### int32ToByteArray(int32: number) : array

Convert 32 bit integer number to 4 character byte array

### byteArrayToInt32(arr: array): number

Convert 4 character byte array to 32 bit integer

### encodeString(str: string): string

Convert utf8 string to base64 string

### decodeString(str64: string): string
 
Convert base64 string to utf8 string

### encodeInt32(int32: number) : string

Convert 32 bit integer to base64 string

### decodeInt32(str64: string): number

Convert base64 string to 32 bit integer

### encodeScalar(value: boolean|number|string): string

Convert boolean or 32 bit integer or utf8 string to base64 string

### decodeScalar(value: string): boolean|number|string

Convert base64 string to boolean or 32 bit integer or utf8 string
