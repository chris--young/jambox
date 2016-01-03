/**
 * server.js
 *
 * @description: Main backend script
 * @author: Chris Young (young.c.5690@gmail.com)
 */

'use strict';

let express = require('express'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    multer = require('multer'),
    mongoose = require('mongoose');

let MP3 = require(`${__dirname}/controllers/mp3.js`);

let app = express(),
    upload = multer(),
    port = process.argv[2] ? process.argv[2] : 8421;

mongoose.connect('mongodb://localhost/jambox');
mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error:'));

app.use(express.static(`${__dirname}/public`));

/**
 * @description: Assigns all requests a unique id for logging
 */
app.use((request, response, next) => {
  request.id = uuid.v4();
  console.log(`* New request [${request.id}] ${request.method} ${request.url}`);
  next();
});

/**
 * GET /
 * @description: Serves the front-end app files
 */
app.get('/', (request, response) => {
  console.log(`* [${request.id}] Successfully served app files`);
  response.sendFile(`${__dirname}/public/app.html`);
});

/**
 * POST /mp3s
 * @description: Uploads a .mp3 file
 */
app.post('/mp3s', upload.single('mp3'), MP3.create);

/**
 * GET /mp3s
 * @description: Responds with all mp3s in the database
 */
app.get('/mp3s', MP3.readAll);

/**
 * GET /mp3s/id
 * @description: Responds with an mp3's file data
 */
app.get('/mp3s/:id', MP3.read);

let server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
