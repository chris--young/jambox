/**
 * public/collections/mp3s.js
 *
 * @description: MP3s collection
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var MP3 = require('../models/mp3.js');

module.exports = Backbone.Collection.extend({

  model: MP3,
  url: 'mp3s',

  /**
   * MP3s.generas()
   * @description: Returns all generas in the collection
   * @returns: {Array}
   */
  generas: function () {
    var generas = ['All'];

    for (var index = 0; index < this.length; index++) {
      var genera = this.at(index).get('genera') ? this.at(index).get('genera') : 'Unknown';

      if (!_.contains(generas, genera)) {
        generas.push(genera);
      }
    }

    return generas;
  },

  /**
   * MP3s.artists()
   * @description: Returns all artists for a genera
   * @returns: {Array}
   */
  artists: function (genera) {
    var artists = ['All'];

    if (!genera) {
      genera = 'All';
    }

    for (var index = 0; index < this.length; index++) {
      var artist = this.at(index).get('artist') ? this.at(index).get('artist') : 'Unknown',
          g = this.at(index).get('genera') ? this.at(index).get('genera') : 'Unknown';

      if (genera === 'All' && !_.contains(artists, artist)) {
        artists.push(artist);
      } else if (genera === g && !_.contains(artists, artist)) {
        artists.push(artist);
      }
    }

    return artists;
  },

  /**
   * MP3s.albums()
   * @description: Returns all albums for an artist
   * @returns: {Array}
   */
  albums: function (artist) {
    var albums = ['All'];

    if (!artist) {
      artist = 'All';
    }

    for (var index = 0; index < this.length; index++) {
      var album = this.at(index).get('album') ? this.at(index).get('album') : 'Unknown',
          a = this.at(index).get('artist') ? this.at(index).get('artist') : 'Unknown';

      if (albums === 'All' && !_.contains(albums, album)) {
        albums.push(album);
      } else if (album === a && !_.contains(albums, album)) {
        albums.push(album);
      }
    }

    return albums;
  },

  /**
   * MP3s.selected()
   * @description: Returns tracks selected by the picker
   * @returns: {Array}
   */
  selected: function (selected, sort) {
    var mp3s = [];

    for (var index = 0; index < this.length; index++) {
      var album = this.at(index).get('album') ? this.at(index).get('album') : 'Unknown',
          artist = this.at(index).get('artist') ? this.at(index).get('artist') : 'Unknown',
          genera = this.at(index).get('genera') ? this.at(index).get('genera') : 'Unknown';

      if ((album === selected.album || selected.album === 'All') &&
          (artist === selected.artist || selected.artist === 'All') &&
          (genera === selected.genera || selected.genera === 'All')) {
        mp3s.push(this.at(index));
      }
    }

    if (sort)
      mp3s.sort(function (a, b) {
        if (a.get(sort.by) < b.get(sort.by))
          return -1 * sort.direction;
        if (a.get(sort.by) > b.get(sort.by))
          return 1 * sort.direction;
        return 0;
      });

    return mp3s;
  }

});
