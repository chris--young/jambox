/**
 * controllers/file.js
 *
 * @description: MP3 file controller layer
 * @author: Chris Young (young.c.5690@gmail.com)
 */

'use strict';

let isMp3 = require('is-mp3');

let MP3 = require(`${__dirname}/../services/mp3.js`);

/**
 * MP3.create()
 * @description: Persists an MP3 to the file system and database
 * @param: {Object} request
 * @param: {Object} response
 */
exports.create = (request, response) => {
  console.log(`* [${request.id}] Received request to upload mp3`);

  if (!request.file) {
    response.status(400).json({ error: 'Request missing file' });
    return console.log(`* [${request.id}] Request missing file`);
  }

  if (!isMp3(request.file.buffer)) {
    response.status(400).json({ error: 'File is not valid MP3' });
    return console.log(`* [${request.id}] File is not valid MP3`);
  }

  MP3.create(request.file, (error, mp3) => {
    if (error) {
      response.status(500).json({ error: 'MP3 upload failed' });
      return console.log(`* [${request.id}] Failed to upload mp3`, error);
    }

    response.status(201).json(mp3.toJSON());
    console.log(`* [${request.id}] Successfully uploaded mp3`, mp3);
  });
};

/**
 * MP3.readAll()
 * @description: Gets all mp3s from the database
 * @param: {Object} request
 * @param: {Object} response
 */
exports.readAll = (request, response) => {
  console.log(`* [${request.id}] Received request to get all mp3s`);

  MP3.readAll((error, mp3s) => {
    if (error) {
      response.status(500).json({ error: 'Failed to retrieve MP3s' });
      return console.log(`* [${request.id}] Failed to retrieve mp3s`, error);
    }

    if (!mp3s.length) {
      response.status(204).end();
    } else {
      response.status(200).json(mp3s);
    }

    console.log(`* [${request.id}] Successfully retrieved ${mp3s.length} mp3s`);
  });
};

/**
 * MP3.read()
 * @description: Gets an mp3's file data
 * @param: {Object} request
 * @param: {Object} response
 */
exports.read = (request, response) => {
  console.log(`* [${request.id}] Received request to get mp3 data`);

  MP3.read(request.params.id, (error, data) => {
    if (error) {
      response.status(500).json({ error: 'Failed to retrieve MP3 data' });
      return console.log(`* [${request.id}] Failed to retrieve mp3 data`, error);
    }

    if (!data) {
      response.status(204).end();
      return console.log(`* [${request.id}] No data found for ${request.params.id}`);
    }

    data.pipe(response);
    console.log(`* [${request.id}] Successfully retrieved mp3 data for ${request.params.id}`);
  });
};
