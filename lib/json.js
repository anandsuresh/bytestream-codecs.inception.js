'use strict';
/**
 * @file Implements serialization/deserialization using JSON
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

/**
 * Export the Json interface
 * @type {Object}
 */
const Json = exports = module.exports = {
  name: 'Javascript Object Notation (JSON)',
  mimeTypes: ['application/json']
};


/**
 * Serializes the specified object into a Buffer
 *
 * @param {*} obj The object to be serialized as a JSON string
 * @param {Object} [opts] Additional options for the serialization operation
 * @param {Function} [opts.replacer] Defines serialization behavior
 * @param {String|Number} [opts.space] Controls white-space usage
 * @return {Buffer}
 */
Json.serialize = function (obj, opts) {
  opts = opts || {};
  return new Buffer(JSON.stringify(obj, opts.replacer, opts.space));
};


/**
 * Deserializes the specified buffer into an object
 *
 * @param {Buffer} buf A UTF-8 encoded buffer
 * @param {Object} [opts] Additional options for the deserialization operation
 * @param {Function} [opts.reviver] Transforms the parsed JSON value
 * @return {*}
 */
Json.deserialize = function (buf, opts) {
  let val;

  try {
    val = JSON.parse(buf.toString('utf8'), opts && opts.reviver);
  } catch (e) {
    return;
  }

  return (val === 'null') ? null : val;
};
