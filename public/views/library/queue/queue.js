/**
 * public/views/library/queue/queue.js
 *
 * @description: Selected library tracks view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Queue.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);
    _.extend(this, Backbone.Events);

    new Request({
      url: 'views/library/queue/queue.tmpl',
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
   * Queue.getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
      $queueTracks: $('tr.queue-track')
    };
  },

  /**
   * Queue.render()
   * @description: Draws the view
   */
  render: function () {
    this.mp3s = this.parent.mp3s.selected(this.parent.subviews.picker.selected);
    this.listenToOnce(this.parent.subviews.picker, 'change', this.update);

    this.$el.html(this.template({
      mp3s: this.mp3s
    }));

    this.getElements();
  },

  /**
   * Queue.events
   * @description: Declares view click events
   */
  events: {
    'click tr.queue-track': 'playTrack'
  },

  /**
   * Queue.update()
   * @description: Changes mp3 content on picker selection
   * @param: {Object} event
   */
  update: function (event) {
    this.mp3s = this.parent.mp3s.selected(event.selected);
    this.render();
  },

  /**
   * Queue.playTrack()
   * @description: Begins MP3 playback
   * @param: {Object} event
   */
  playTrack: function (event) {
    var $target = $(event.target),
        $tr = $target.parents('tr'),
        id = $tr.data('id'),
        mp3 = _.findWhere(this.mp3s, { id: id });

    this.parent.parent.sound.source(mp3);
    this.listenToOnce(this.parent.parent.sound, 'stop', this.stop);
    this.elements.$queueTracks.removeClass('playing');
    $tr.addClass('playing');
  },

  /**
   * Queue.stop()
   * @description: Removes playing indicator at end of playback
   */
  stop: function () {
    this.elements.$queueTracks.removeClass('playing');
  }

});
