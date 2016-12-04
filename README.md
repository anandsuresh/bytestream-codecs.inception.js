# inception.object-codecs [![Build Status](https://travis-ci.org/inception-soa/inception.object-codecs.svg?branch=master)](https://travis-ci.org/inception-soa/inception.object-codecs)

Serialization/deserialization primitives for JavaScript. This is a library that
provides another layer of abstraction to serialization/deserialization within an
application.

## installation

Use the following command to install the library from npm:

```
npm install inception.object-codecs
```

## usage

The library provides 2 functions:

- `serialize(codecName, obj, options)`: Used to serialize an object
- `deserialize(codecName, buf, options)`: Used to deserialize an object

### codecs supported

- `json`
- `msgpack`

### options

`options` is an optional object that depends on the codec being used. Each codec
has a different set of options, as listed below.

- `json`:
  - `serialize()`:
    - `replacer`: See [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter)
    - `space`: See [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_argument)

  - `deserialize()`:
    - `reviver`: See [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter)

## contact

All feedback/suggestions/criticisms can be directed to [Anand Suresh](http://www.github.com/anandsuresh)
