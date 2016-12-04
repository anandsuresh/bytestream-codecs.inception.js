'use strict';
/**
 * @file Unit tests for the bytestream codecs
 *
 * @author Anand Suresh <anandsuresh@gmail.com>
 * @copyright Copyright 2016 Anand Suresh
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Codecs = require('..');


const CODECS = Codecs.SUPPORTED;


const TESTS = {
  'serialize': {
    'json': {
      'null': [
        { input: null, output: Buffer('null') }
      ],
      'strings': [
        { input: '', output: Buffer('""') },
        { input: 'json', output: Buffer('"json"') }
      ],
      'numbers': [
        { input: NaN, output: Buffer('null') },
        { input: +Infinity, output: Buffer('null') },
        { input: -Infinity, output: Buffer('null') },
        { input: 42, output: Buffer('42') },
        { input: 42.5, output: Buffer('42.5') },
      ],
      'booleans': [
        { input: true, output: Buffer('true') },
        { input: false, output: Buffer('false') }
      ],
      'arrays': [
        { input: [], output: Buffer('[]') },
        { input: [1, 2, 3], output: Buffer('[1,2,3]') },
        { input: ['a', 'b', 'c'], output: Buffer('["a","b","c"]') }
      ],
      'objects': [
        { input: {}, output: Buffer('{}') },
        { input: { foo: 'bar' }, output: Buffer('{"foo":"bar"}') }
      ]
    },
    'msgpack': {
      'null': [
        { input: null, output: Buffer([0xc0]) }
      ],
      'strings': [
        { input: '', output: Buffer([0xa0]) },
        { input: 'msgpack', output: Buffer([0xa7, 0x6d, 0x73, 0x67, 0x70, 0x61, 0x63, 0x6b]) } // eslint-disable-line max-len
      ],
      'numbers': [
        { input: NaN, output: Buffer([0xca, 0x7f, 0xc0, 0x00, 0x00]) },
        { input: +Infinity, output: Buffer([0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) }, // eslint-disable-line max-len
        { input: -Infinity, output: Buffer([0xcb, 0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) }, // eslint-disable-line max-len
        { input: 42, output: Buffer([0x2a]) },
        { input: 42.5, output: Buffer([0xca, 0x42, 0x2a, 0x00, 0x00]) },
      ],
      'booleans': [
        { input: true, output: Buffer([0xc3]) },
        { input: false, output: Buffer([0xc2]) }
      ],
      'arrays': [
        { input: [], output: Buffer([0x90]) },
        { input: [1, 2, 3], output: Buffer([0x93, 0x01, 0x02, 0x03]) },
        { input: ['a', 'b', 'c'], output: Buffer([0x93, 0xa1, 0x61, 0xa1, 0x62, 0xa1, 0x63]) } // eslint-disable-line max-len
      ],
      'objects': [
        { input: {}, output: Buffer([0x80]) },
        { input: { foo: 'bar' }, output: Buffer([0x81, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72]) } // eslint-disable-line max-len
      ]
    }
  },
  'deserialize': {
    'json': {
      'null': [
        { input: Buffer('null'), output: null }
      ],
      'strings': [
        { input: Buffer('""'), output: '' },
        { input: Buffer('"json"'), output: 'json' }
      ],
      'numbers': [
        { input: Buffer('42'), output: 42 }
      ],
      'booleans': [
        { input: Buffer('true'), output: true },
        { input: Buffer('false'), output: false }
      ],
      'arrays': [
        { input: Buffer('[]'), output: [] },
        { input: Buffer('[1,2,3]'), output: [1, 2, 3] },
        { input: Buffer('["a","b","c"]'), output: ['a', 'b', 'c'] }
      ],
      'objects': [
        { input: Buffer('{}'), output: {} },
        { input: Buffer('{"foo":"bar"}'), output: { foo: 'bar' } }
      ]
    },
    'msgpack': {
      'null': [
        { input: Buffer([0xc0]), output: null }
      ],
      'strings': [
        { input: Buffer([0xa0]), output: '' },
        { input: Buffer([0xa7, 0x6d, 0x73, 0x67, 0x70, 0x61, 0x63, 0x6b]), output: 'msgpack' } // eslint-disable-line max-len
      ],
      'numbers': [
        { input: Buffer([0xca, 0x7f, 0xc0, 0x00, 0x00]), output: NaN },
        { input: Buffer([0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), output: +Infinity }, // eslint-disable-line max-len
        { input: Buffer([0xcb, 0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), output: -Infinity }, // eslint-disable-line max-len
        { input: Buffer([0x2a]), output: 42 },
        { input: Buffer([0xca, 0x42, 0x2a, 0x00, 0x00]), output: 42.5 },
      ],
      'booleans': [
        { input: Buffer([0xc3]), output: true },
        { input: Buffer([0xc2]), output: false }
      ],
      'arrays': [
        { input: Buffer([0x90]), output: [] },
        { input: Buffer([0x93, 0x01, 0x02, 0x03]), output: [1, 2, 3] },
        { input: Buffer([0x93, 0xa1, 0x61, 0xa1, 0x62, 0xa1, 0x63]), output: ['a', 'b', 'c'] } // eslint-disable-line max-len
      ],
      'objects': [
        { input: Buffer([0X80]), output: {} },
        { input: Buffer([0x81, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72]), output: { foo: 'bar' } } // eslint-disable-line max-len
      ]
    }
  }
};


describe('Object Codecs', function () {
  it('should support all the output codecs', function () {
    expect(CODECS).to.have.all.keys(['json', 'msgpack']);
  });

  it('should support the .serialize() and .deserialize() methods', function () {
    Object.keys(CODECS).forEach(function (codecName) {
      let codec = CODECS[codecName];

      expect(codec.serialize).to.be.a('function');
      expect(codec.serialize.length).to.equal(2);

      expect(codec.deserialize).to.be.a('function');
      expect(codec.deserialize.length).to.equal(2);
    });
  });


  describe('.serialize()', function () {
    Object.keys(CODECS).forEach(function (codecName) {
      let codec = CODECS[codecName];

      describe(codecName, function () {
        it(`should support serialization for ${codecName}`, function () {
          let spyCodecSerialize = sinon.spy(codec, 'serialize');
          Codecs.serialize(codecName, 'bytestream-codecs');
          expect(spyCodecSerialize.calledOnce).to.be.true;
        });

        Object.keys(TESTS['serialize'][codecName]).forEach(function (type) {
          it(`should correctly serialize ${type}`, function () {
            TESTS['serialize'][codecName][type].forEach(function (test) {
              let actual = codec.serialize(test.input).toString('hex');
              let expected = test.output.toString('hex');

              expect(actual).to.equal(expected);
            });
          });
        });
      });
    });
  });


  describe('.deserialize()', function () {
    Object.keys(CODECS).forEach(function (codecName) {
      let codec = CODECS[codecName];

      describe(codecName, function () {
        it(`should support deserialization for ${codecName}`, function () {
          let spyCodecDeserialize = sinon.spy(CODECS[codecName], 'deserialize');
          Codecs.deserialize(codecName, 'bytestream-codecs');
          expect(spyCodecDeserialize.calledOnce).to.be.true;
        });


        Object.keys(TESTS['deserialize'][codecName]).forEach(function (type) {
          it(`should correctly deserialize ${type}`, function () {
            TESTS['deserialize'][codecName][type].forEach(function (test) {
              let actual = codec.deserialize(test.input);
              let expected = test.output;

              expect(actual).to.deep.equal(expected);
            });
          });
        });
      });
    });
  });
});
