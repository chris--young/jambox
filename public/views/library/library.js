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

    this.subviews = {};
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
   * Library.getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
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
      return this.$el.html(this.parent.templates.error());
    }

    this.$el.html(this.template());
    this.getElements();

    this.mp3s.on('error', function (event) {
      that.$el.html(that.parent.templates.error());
      console.log('Library.mp3s error:', error);
    });

    this.mp3s.on('sync', function (mp3s) {
      that.showContent();
      that.mp3s.on('update', function () {
        that.showContent();
      });
    });

    this.mp3s.fetch();
  },

  /**
   * Library.showContent()
   * @description: Shows the picker and queue or error
   */
  showContent: function () {
    async.series([
      _.bind(this.showPicker, this),
      _.bind(this.showQueue, this)
    ], function (error) {
      if (error) {
        this.$el.html(this.parent.templates.error());
        console.log('Library.render() error:', error);
      }
    });
  },

  /**
   * Library.showPicker()
   * @description: Creates the picker subview or renders it if it already exists
   * @param: {Function} callback
   */
  showPicker: function (callback) {
    if (!this.subviews.picker) {
      this.subviews.picker = new Picker({
        parent: this,
        el: this.elements.$picker,
        callback: callback
      });
    } else {
      this.subviews.picker.render();
      callback();
    }
  },

  /**
   * Library.showQueue()
   * @description: Creates the queue subview or renders it if it already exists
   * @param: {Function} callback
   */
  showQueue: function (callback) {
    if (!this.subviews.queue) {
      this.subviews.queue = new Queue({
        parent: this,
        el: this.elements.$queue,
        callback: callback
      });
    } else {
      this.subviews.queue.render();
      callback();
    }
  }

});
