/**
 * public/models/mp3.js
 *
 * @description: MP3 model
 * @author: Chris Young (young.c.5690@gmail.com)
 */

module.exports = Backbone.Model.extend({

  defaults: {
    id: null,
    fileName: null,
    title: null,
    album: null,
    artist: null,
    track: null,
    genera: null,
    bitrate: null,
    samplingRate: null,
    length: null
  }

});
