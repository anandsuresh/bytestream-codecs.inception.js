'use strict';
/**
 * @file Serialization/deserialization primitives
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

const node = {
  fs: require('fs'),
  path: require('path')
};
const _ = require('lodash');


/**
 * Export the interface
 * @type {Object}
 */
const Codecs = exports = module.exports;


/**
 * A list of supported codecs
 * @type {Object}
 */
Codecs.SUPPORTED = (function getSupported() {
  const dir = node.path.resolve(__dirname, 'lib');
  const supported = {};

  node.fs.readdirSync(dir).forEach(function (file) {
    let name = node.path.basename(file, node.path.extname(file));
    supported[name] = require(node.path.resolve(dir, file));
  });

  return supported;
}());


/**
 * A list of supported MIME types
 * @type {Object}
 */
Codecs.MIME_TYPES = (function getMimeTypes() {
  const supported = {};

  _.forEach(Codecs.SUPPORTED, (codec, name) => {
    _.forEach(codec.mimeTypes, (mimeType) => {
      supported[mimeType] = name;
    });
  });

  return supported;
}());


/**
 * Returns whether or not the specified codec is supported
 *
 * @param {String} name The name or MIME type to check
 * @return {Boolean}
 */
Codecs.isSupported = function (name) {
  return (name in Codecs.SUPPORTED || name in Codecs.MIME_TYPES);
};


/**
 * Returns whether or not the specified codec/MIME type is supported
 *
 * @param {String} name The name or MIME type to check
 * @return {Object}
 */
Codecs.getCodec = function (name) {
  if (name in Codecs.SUPPORTED)
    return Codecs.SUPPORTED[name];

  if (name in Codecs.MIME_TYPES)
    return Codecs.SUPPORTED[Codecs.MIME_TYPES[name]];
};


/**
 * Serializes the specified object using the specified codec
 *
 * @param {String} name The name of the codec to use for deserialization
 * @param {*} obj The object to be serialized
 * @param {Object} [options] Additional options for serialization
 * @return {Buffer} The resulting object from deserialization
 */
Codecs.serialize = function (name, obj, options) {
  return (Codecs.SUPPORTED[name]).serialize(obj, options);
};


/**
 * Deserializes the specified buffer using the specified codec
 *
 * @param {String} name The name of the codec to use for deserialization
 * @param {Buffer} buf The buffer containing the serialized object
 * @param {Object} [options] Additional options for deserialization
 * @return {*} The resulting object from deserialization
 */
Codecs.deserialize = function (name, buf, options) {
  return Codecs.SUPPORTED[name].deserialize(buf, options);
};
