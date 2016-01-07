/**
 * public/views/header/info/info.js
 *
 * @description: Playback track information view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Info.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    new Request({
      url: 'views/header/info/info.tmpl',
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
   * getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
      $elapsed: $('#elapsed-time'),
      $remaining: $('#remaining-time'),
      $time: $('#time')
    };
  },

  /**
   * Info.render()
   * @description: Draws the view
   */
  render: function () {
    this.mp3 = this.parent.parent.sound.mp3;

    this.$el.html(this.template({
      mp3: this.mp3,
      elapsed: this.parent.parent.sound.elapsed(),
      remaining: this.parent.parent.sound.remaining(),
      time: this.parent.parent.sound.elapsed(true)
    }));

    this.getElements();
    this.listenTo(this.parent.parent.sound, 'update', this.update);
    this.listenToOnce(this.parent.parent.sound, 'start', this.start);
    this.listenToOnce(this.parent.parent.sound, 'stop', this.render);
  },

  /**
   * Info.start()
   * @description: Updates track information at begining of playback
   * @param: {Object} event
   */
  start: function (event) {
    this.mp3 = event.mp3;
    this.render();
  },

  /**
   * Info.update()
   * @description: Updates track progress bar
   * @param: {Object} event
   */
  update: function (event) {
    var elapsed = this.parent.parent.sound.elapsed(),
        remaining = this.parent.parent.sound.remaining();

    this.elements.$elapsed.text(elapsed);
    this.elements.$remaining.text(remaining);
    this.elements.$time.width(event.elapsed + '%');
  }

});
