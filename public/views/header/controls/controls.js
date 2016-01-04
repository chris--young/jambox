/**
 * public/views/header/controls/controls.js
 *
 * @description: Playback controls view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Controls.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    new Request({
      url: 'views/header/controls/controls.tmpl',
      callback: function (error, body) {
        if (error) {
          return that.callback(error);
        }

        that.template = _.template(body);
        that.render();
        that.callback();
      }
    });
  },

  /**
   * Controls.getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
      $backward: $('#backward'),
      $playPause: $('#play-pause'),
      $playPauseSpan: $('#play-pause span'),
      $forward: $('#forward')
    };
  },

  /**
   * Controls.render()
   * @description: Draws the view
   */
  render: function () {
    this.$el.html(this.template());
    this.getElements();
  },

  /**
   * Controls.events
   * @description: Declares click events
   */
  events: {
    'click #backward': 'backward',
    'click #play-pause': 'playPause',
    'click #forward': 'forward'
  },

  /**
   * Controls.backward()
   * @description: Begins playback of the previous track in the queue
   * @param: {Object} event
   */
  backward: function (event) {
    event.preventDefault();
  },

  /**
   * Controls.playPause()
   * @description: Toggles playback of the current track
   * @param: {Object} event
   */
  playPause: function (event) {
    event.preventDefault();

    if (this.elements.$playPauseSpan.hasClass('fa-play')) {
      this.elements.$playPauseSpan.removeClass('fa-play').addClass('fa-pause');
    } else {
      this.elements.$playPauseSpan.removeClass('fa-pause').addClass('fa-play');
    }
  },

  /**
   * Controls.forward()
   * @description: Begins playback of the next track in the queue
   * @param: {Object} event
   */
  forward: function (event) {
    event.preventDefault();
  }

});
