/**
 * models/mp3.js
 *
 * @description: MP3 model schema
 * @author: Chris Young (young.c.5690@gmail.com)
 */

'use strict';

let mongoose = require('mongoose');

/**
 * MP3
 * @description: MP3 schema
 */
let mp3Schema = mongoose.Schema({
  fileName: String,
  filePath: String,
  title: String,
  album: String,
  artist: String,
  track: String,
  genera: String,
  bitrate: Number,
  samplingRate: Number,
  length: Number
});

/**
 * MP3.toJSON()
 * @description: Returns only the necessary attributes for server responses
 */
mp3Schema.methods.toJSON = function () {
  return {
    id: this._id,
    fileName: this.fileName,
    title: this.title,
    album: this.album,
    artist: this.artist,
    track: this.track,
    genera: this.genera,
    bitrate: this.bitrate,
    samplingRate: this.samplingRate,
    length: this.length
  };
};

module.exports = mongoose.model('MP3', mp3Schema);
