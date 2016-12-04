'use strict';
/**
 * @file Implements serialization/deserialization using MessagePack
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

const msgpack = require('msgpack5')();


/**
 * Export the MsgPack interface
 * @type {Object}
 */
const MsgPack = exports = module.exports = {
  name: 'MessagePack',
  mimeTypes: ['application/msgpack']
};


/**
 * Serializes the specified object into a Buffer
 *
 * @param {*} obj The object to be serialized as a JSON string
 * @return {Buffer} A buffer containing the msgpack'd bytes
 */
// eslint-disable-next-line no-unused-vars
MsgPack.serialize = function serialize(obj, opts) {
  return msgpack.encode(obj).slice();
};


/**
 * Deserializes the specified buffer into an object
 *
 * @param {Buffer} buf A buffer containing the msgpack'd bytes
 * @param {Object} [opts] Additional options for the deserialization operation
 * @return {*}
 */
// eslint-disable-next-line no-unused-vars
MsgPack.deserialize = function deserialize(buf, opts) {
  return msgpack.decode(buf);
};
