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

    this.$el.html(this.template({
      mp3s: this.mp3s
    }));

    this.getElements();
    this.listenToOnce(this.parent.subviews.picker, 'change', this.update);
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
        index = $tr.data('index'),
        mp3 = _.findWhere(this.mp3s, { id: id });

    this.playing = index;
    this.parent.parent.sound.source(mp3);
    this.listenToOnce(this.parent.parent.sound, 'stop', this.forward);
    this.elements.$queueTracks.removeClass('playing');
    $tr.addClass('playing');
  },

  /**
   * Queue.backward()
   * @description: Begins playing the previous track if there is one
   */
  backward: function () {
    this.elements.$queueTracks.removeClass('playing');

    if (this.parent.parent.views.header.subviews.settings.repeat && this.playing === 0) {
      this.playing = this.mp3s.length;
    }

    if (this.playing > 0) {
      if (this.parent.parent.views.header.subviews.settings.random) {
        this.playing = Math.floor(Math.random() * (this.mp3s.length - 1)) + this.mp3s.length - 1;
      } else {
        this.playing--;
      }

      this.parent.parent.sound.source(this.mp3s[this.playing]);
      this.listenToOnce(this.parent.parent.sound, 'stop', this.foward);
      $('tr.queue-track[data-index="' + this.playing + '"]').addClass('playing');
    } else {
      this.stopListening(this.parent.parent.sound, 'stop');
      this.parent.parent.sound.stop();
      this.playing = null;
    }
  },

  /**
   * Queue.forward()
   * @description: Begins playing the next track if there is one
   */
  forward: function () {
    this.elements.$queueTracks.removeClass('playing');

    if (this.parent.parent.views.header.subviews.settings.repeat && this.playing === this.mp3s.length - 1) {
      this.playing = -1;
    }

    if (this.playing !== null) {
      if (this.playing < this.mp3s.length - 1) {
        if (this.parent.parent.views.header.subviews.settings.random) {
          this.playing = Math.floor(Math.random() * (this.mp3s.length - 1)) + this.mp3s.length - 1;
        } else {
          this.playing++;
        }

        console.log('this.playing', this.playing);

        this.parent.parent.sound.source(this.mp3s[this.playing]);
        this.listenToOnce(this.parent.parent.sound, 'stop', this.forward);
        $('tr.queue-track[data-index="' + this.playing + '"]').addClass('playing');
      } else {
        this.stopListening(this.parent.parent.sound, 'stop');
        this.parent.parent.sound.stop();
        this.playing = null;
      }
    }
  }

});
