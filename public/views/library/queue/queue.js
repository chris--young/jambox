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

    this.playing = null;
    this.sort = {
      by: 'fileName',
      direction: 1
    };

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
    this.mp3s = this.parent.mp3s.selected(this.parent.subviews.picker.selected, this.sort);

    this.$el.html(this.template({
      mp3s: this.mp3s,
      playing: this.playing,
      sort: this.sort
    }));

    this.getElements();
    this.listenToOnce(this.parent.subviews.picker, 'change', this.update);
  },

  /**
   * Queue.events
   * @description: Declares view click events
   */
  events: {
    'click tr.queue-track': 'playTrack',
    'click a.sort-queue': 'sortQueue'
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

    this.playing = id;
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
    var index = this.playingIndex();

    this.elements.$queueTracks.removeClass('playing');

    if (this.parent.parent.views.header.subviews.settings.repeat && index === 0) {
      index = this.mp3s.length;
    }

    if (index > 0) {
      if (this.parent.parent.views.header.subviews.settings.random) {
        index = Math.floor(Math.random() * (this.mp3s.length - 1)) + this.mp3s.length - 1;
      } else {
        index--;
      }

      this.playing = this.mp3s[index].get('id');
      this.parent.parent.sound.source(this.mp3s[index]);
      this.listenToOnce(this.parent.parent.sound, 'stop', this.foward);
      $('tr.queue-track[data-id="' + this.playing + '"]').addClass('playing');
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
    var index = this.playingIndex();

    this.elements.$queueTracks.removeClass('playing');

    if (this.parent.parent.views.header.subviews.settings.repeat && index === this.mp3s.length - 1) {
      index = -1;
    }

    if (index !== null) {
      if (index < this.mp3s.length - 1) {
        if (this.parent.parent.views.header.subviews.settings.random) {
          index = Math.floor(Math.random() * (this.mp3s.length - 1)) + this.mp3s.length - 1;
        } else {
          index++;
        }

        this.playing = this.mp3s[index].get('id');
        this.parent.parent.sound.source(this.mp3s[index]);
        this.listenToOnce(this.parent.parent.sound, 'stop', this.forward);
        $('tr.queue-track[data-id="' + this.playing + '"]').addClass('playing');
      } else {
        this.stopListening(this.parent.parent.sound, 'stop');
        this.parent.parent.sound.stop();
        this.playing = null;
      }
    }
  },

  /**
   * Queue.sortQueue()
   * @description: Reorders queue
   * @param: {Object} event
   */
  sortQueue: function (event) {
    var $target = $(event.currentTarget),
        by = $target.data('by');

    event.preventDefault();

    if (this.sort.by === by)
      this.sort.direction *= -1;
    else
      this.sort.by = by;

    this.render();
  },

  /**
   * Queue.playingIndex()
   * @description: Returns the current song's position in the queue
   * @returns: {Number} index
   */
  playingIndex: function () {
    var that = this,
        playing = null;

    this.mp3s.forEach(function (mp3, index) {
      if (that.playing === mp3.get('id'))
        playing = index;
    });

    return playing;
  }

});
