/**
 * services/file.js
 *
 * @description: MP3 file service layer
 * @author: Chris Young (young.c.5690@gmail.com)
 */

'use strict';

let fs = require('fs'),
    uuid = require('node-uuid'),
    mp3Parser = require('mp3-parser'),
    mp3Duration = require('mp3-duration'),
    _ = require('lodash');

let MP3 = require(`${__dirname}/../models/mp3.js`);

/**
 * bufferToArrayBuffer()
 * @description: Converts a Buffer to ArrayBuffer
 * @param: {Buffer} buffer
 * @returns: {ArrayBuffer}
 */
function bufferToArrayBuffer(buffer) {
  let uint8Array = new Uint8Array(new ArrayBuffer(buffer.length));

  for (let index = 0; index < buffer.length; index++) {
    uint8Array[index] = buffer[index];
  }

  return uint8Array.buffer;
}

/**
 * getMetaData()
 * @description: Attempts to get MP3 file meta data
 * @param: {MP3} mp3
 * @param: {Buffer} file
 * @param: {Function} callback
 */
function getMetaData(mp3, file, callback) {
  let dataView = new DataView(bufferToArrayBuffer(file.buffer)),
      mp3Tags = mp3Parser.readTags(dataView);

  mp3Duration(mp3.filePath, (error, duration) => {
    if (error) {
      return callback(error);
    }

    mp3.length = duration;

    mp3Tags.forEach((tag) => {
      switch (tag._section.type) {
        case 'ID3v2':
          _.each(tag.frames, (frame) => {
            switch (frame.name) {
              case 'Title/songname/content description':
                mp3.title = frame.content.value;
                break;
              case 'Album/Movie/Show title':
                mp3.album = frame.content.value;
                break;
              case 'Lead performer(s)/Soloist(s)':
                mp3.artist = frame.content.value;
                break;
              case 'Track number/Position in set':
                mp3.track = frame.content.value;
              default:
                break;
            }
          });
          break;
        case 'frame':
          mp3.bitrate = tag.header.bitrate;
          mp3.samplingRate = tag.header.samplingRate;
          break;
        case 'Xing':
          mp3.bitrate = tag.header.bitrate;
          mp3.samplingRate = tag.header.samplingRate;
          break;
        default:
          break;
      }
    });

    callback();
  });
}

/**
 * MP3.create()
 * @description: Persists an MP3 to the file system and database
 * @param: {Object} file
 * @param: {Function} callback
 */
exports.create = (file, callback) => {
  let filePath = `${__dirname}/../uploads/${file.originalname}`;

  fs.writeFile(filePath, file.buffer, (error) => {
    if (error) {
      return callback(error);
    }

    let mp3 = new MP3({
      fileName: file.originalname,
      filePath: filePath
    });

    getMetaData(mp3, file, (error) => {
      if (error) {
        return callback(error);
      }

      mp3.save((error, mp3) => {
        if (error) {
          return callback(error);
        }

        callback(null, mp3);
      });
    });
  });
};

/**
 * MP3.readAll()
 * @description: Retrieves all mp3s from the database
 * @param: {Function} callback
 */
exports.readAll = (callback) => {
  MP3.find((error, mp3s) => {
    if (error) {
      return callback(error);
    }

    callback(null, mp3s);
  });
};

/**
 * MP3.read()
 * @description: Retrieves an mp3's file data
 * @param: {String} id
 * @param: {Function} callback
 */
exports.read = (id, callback) => {
  MP3.find({ _id: id }, (error, mp3s) => {
    if (error) {
      return callback(error);
    }

    if (!mp3s.length) {
      return callback();
    }

    fs.readFile(mp3s[0].filePath, (error, data) => {
      if (error) {
        return callback(error);
      }

      return callback(null, data);
    });
  });
};
