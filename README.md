# Firebase64

Combines two closure library functions with the d64 module to encode/decode (array of) boolean, 32 bit integer, string to/from a ascii embeddable, lexicographic sortable value that can be used as firebase key.

The generated encoded strings can be used to create a firebase:
- (multi-)field filter index
- (multi-)field sort values

The implementation uses the following character set: ,PYFGCRLAOEUIDHTNSQJKXBMWVZ_pyfgcrlaoeuidhtnsqjkxbmwvz1234567890

Array items are separated by the character: ~

Example:
```
	const {encode, decode} = require('firebase64');
	
	// String Example:
	const sEncoded = encode('a');
	const sDecoded = decode(sEncoded));
	// sEncoded === 'sNF', sDecoded === 'a'
	//
	// Integer Example:
	const nEncoded = encode(101);
	const nDecoded = decode(nEncoded));
	// nEncoded === 'n,,,,OF', nDecoded === 101
	//
	// Boolean Example:
	const bEncoded = encode(true);
	const bDecoded = decode(bEncoded));
	// bEncoded === 'b1', bDecoded === true
	//
	// Array Example:
	const aEncoded = encode(['a', 0, true]);
	const aDecoded = decode(aEncoded));
	// aEncoded === 'asNF~n,,,,OF~b1', aDecoded === ['a', 0, true]
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
