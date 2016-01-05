/**
 * public/utils/sound.js
 *
 * @description: HTML5 audio wrapper class
 * @author: Chris Young (young.c.5690@gmail.com)
 */

// TODO: Handle unsupported browsers
// TODO: Handle src load errors

function Sound(options) {
  _.extend(this, options);
  _.extend(this, Backbone.Events);

  this.element = document.querySelector('#audio');
  this.element.volume = '0.1';
}

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
    this.element.addEventListener('eneded', _.bind(this.stop, this));
  }
};

/**
 * Sound.play()
 */
Sound.prototype.play = function () {
  if (this.mp3) {
    this.element.play();
    this.playing = true;
  }
};

/**
 * Sound.pause()
 */
Sound.prototype.pause = function () {
  this.element.pause();
  this.playing = false;
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
 * Sound.elapsed()
 * @description: Returns the length of track that has already been played
 * @param: {Boolean} percentage
 * @returns: {Number}
 */
Sound.prototype.elapsed = function (percentage) {
  if (percentage) {
    return Math.floor(this.element.currentTime / this.element.duration * 100);
  } else {
    return Math.floor(this.element.currentTime);
  }
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
 * Sound.duration()
 * @description: Returns the total length of track
 * @returns: {Number}
 */
Sound.prototype.duration = function () {
  return Math.floor(this.element.duration);
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
