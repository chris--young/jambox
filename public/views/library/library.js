/**
 * public/views/library/library.js
 *
 * @description: Music library view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../utils/request.js');

var MP3s = require('../../collections/mp3s.js');

var Picker = require('./picker/picker.js'),
    Queue = require('./queue/queue.js');

module.exports = Backbone.View.extend({

  /**
   * Library.initialize()
   * @description: Loads view template and collection
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    this.errorTemplate = _.template(this.parent.ui.$errorTemplate.html());
    this.loadingTemplate = _.template(this.parent.ui.$loadingTemplate.html());

    this.mp3s = new MP3s();

    new Request({
      url: 'views/library/library.tmpl',
      callback: function (error, body) {
        if (!error) {
          that.template = _.template(body);
        }

        that.render();
      }
    });
  },
    
  /**
   * Library.setUiElements()
   * @description: Gets DOM references for view elements
   */
  setUiElements: function () {
    this.ui = {
      $picker: $('#picker'),
      $queue: $('#queue')
    };
  },

  /**
   * Library.render()
   * @description: Draws the view
   */
  render: function () {
    var that = this;

    if (!this.template) {
      return this.$el.html(this.errorTemplate());
    }

    this.$el.html(this.template());
    this.setUiElements();

    this.mp3s.on('error sync', function (event) {

      async.series([function (callback) {
        if (!that.picker) {
          that.picker = new Picker({
            parent: that,
            el: that.ui.$picker,
            callback: callback
          });
        } else {
          that.picker.render();
          callback();
        }
      }, function (callback) {
        if (!that.queue) {
          that.queue = new Queue({
            parent: that,
            el: that.ui.$queue,
            callback: callback
          });
        } else {
          that.queue.render();
          callback();
        }
      }], function (error) {
        if (error) {
          return that.$el.html(that.errorTemplate());
        }
      });

    });

    /* this.mp3s.on('error sync', function (event) {
      console.log('mp3s:', that.mp3s);

      var audio = document.querySelector('#audio');
      audio.src = 'mp3s/' + that.mp3s.at(0).get('id');
      audio.play();

      console.log('generas:', that.mp3s.generas());
      console.log('artists:', that.mp3s.artists());
      console.log('albums:', that.mp3s.albums());
    }); */

    this.mp3s.fetch();
  }

});
