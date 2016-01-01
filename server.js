/**
 * server.js
 *
 * @description: Main backend script
 * @author: Chris Young (young.c.5690@gmail.com)
 */

'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('node-uuid');

let app = express(),
    port = process.argv[2] ? process.argv[2] : 8421;

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

let server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
