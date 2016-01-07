/**
 * public/utils/sound.js
 *
 * @description: HTML5 audio wrapper class
 * @author: Chris Young (young.c.5690@gmail.com)
 *
 * TODO: trigger a backbone event so info doesn't need to listen directly to the timeupdate event
 */

var Modal = require('./modal.js');

function Sound(options) {
  _.extend(this, options);
  _.extend(this, Backbone.Events);

  this.element = document.querySelector('#audio');

  if (!this.element.canPlayType) {
    throw 'HTML5 audio is not supported in this browser';
  } else if (this.element.canPlayType('audio/mp3') === '') {
    throw 'MP3 playback is not supported in this browser';
  }

  this.element.volume = '0.5';
  this.element.addEventListener('error', _.bind(this.error, this));
  this.element.addEventListener('ended', _.bind(this.stop, this));
  this.element.addEventListener('timeupdate', _.bind(this.update, this));
}

/**
 * Sound.error()
 * @description: Displays an error modal and triggers an error event
 * @param: {Object} event
 */
Sound.prototype.error = function (event) {
  var that = this;

  if (this.mp3) {
    if (!this.modal) {
      this.modal = new Modal({
        title: 'Error',
        message: 'The MP3 failed to load.',
        buttons: [{ text: 'Ok', callback: function () { that.modal.close(); } }]
      });
    } else {
      this.modal.render();
    }

    this.trigger('error', event);
  }
};

/**
 * Sound.source()
 * @description: Begins playback of an MP3
 */
Sound.prototype.source = function (mp3) {
  if (!this.mp3 || this.mp3.get('id') !== mp3.get('id')) {
    this.mp3 = mp3;
    this.element.src = 'mp3s/' + this.mp3.get('id');
    this.element.play();
    this.playing = true;
    this.trigger('start', { mp3: this.mp3 });
  }
};

/**
 * Sound.playPause()
 * @description: Toggles playback of the current track
 * @returns {Boolean}
 */
Sound.prototype.playPause = function () {
  if (this.mp3) {
    if (this.playing) {
      this.playing = false;
      this.element.pause();
    } else {
      this.playing = true;
      this.element.play();
    }
  }

  return this.playing;
};

/**
 * Sound.stop()
 * @description: Ends playback of MP3
 */
Sound.prototype.stop = function () {
  this.mp3 = null;
  this.element.src = '';
  this.playing = false;
  this.trigger('stop');
};

/**
 * Sound.update()
 * @description: Triggers update event with the elapsed time as a percentage
 * @param: {Object} event
 */
Sound.prototype.update = function (event) {
  this.trigger('update', { elapsed: this.element.currentTime / this.element.duration * 100 });
};

/**
 * Sound.elapsed()
 * @description: Returns the length of track that has already been played
 * @returns: {Number}
 */
Sound.prototype.elapsed = function () {
  return Math.floor(this.element.currentTime);
};

/**
 * Sound.remaining()
 * @description: Returns the length of track that has not yet been played
 * @returns: {Number}
 */
Sound.prototype.remaining = function () {
  return Math.floor(this.element.duration - this.element.currentTime);
};

/**
 * Sound.volume()
 * @description: Gets and sets playback volume
 * @param: {String} volume
 * @returns: {String}
 */
Sound.prototype.volume = function (volume) {
  if (volume) {
    this.element.volume = volume;
  }

  return this.element.volume;
};

module.exports = Sound;
