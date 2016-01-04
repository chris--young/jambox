/**
 * public/views/header/header.js
 *
 * @description: Header view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../utils/request.js');

var Controls = require('./controls/controls.js'),
    Info = require('./info/info.js'),
    Settings = require('./settings/settings.js');

module.exports = Backbone.View.extend({

  /**
   * Header.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    this.subviews = {};

    new Request({
      url: 'views/header/header.tmpl',
      callback: function (error, body) {
        if (error) {
          return that.callback(error);
        }

        that.template = _.template(body);
        that.render();
        that.$el.removeClass('hidden');
        that.callback();
      }
    });
  },

  /**
   * Header.getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
      $contentWrapper: $('#content-wrapper'),
      $controls: $('#controls'),
      $info: $('#info'),
      $settings: $('#settings')
    };
  },

  /**
   * Header.render()
   * @description: Draws the view
   */
  render: function () {
    var that = this;

    this.$el.html(this.template());
    this.getElements();

    async.series([
      _.bind(this.showControls, this),
      _.bind(this.showInfo, this),
      _.bind(this.showSettings, this)
    ], function (error) {
      if (error) {
        return that.callback(error);
      }

      that.elements.$contentWrapper.css('height', 'calc(100% - ' + that.$el.height() + 'px)');
    });
  },

  /**
   * Header.showControls()
   * @description: Creates controls subview or renders it if it already exists
   * @param: {Function} callback
   */
  showControls: function (callback) {
    if (!this.subviews.controls) {
      this.subviews.controls = new Controls({
        parent: this,
        el: this.elements.$controls,
        callback: callback
      });
    } else {
      this.subviews.controls.render();
      callback();
    }
  },

  /**
   * Header.showInfo()
   * @description: Creates info subview or renders it if it already exists
   * @param: {Function} callback
   */
  showInfo: function (callback) {
    if (!this.subviews.info) {
      this.subviews.info = new Info({
        parent: this,
        el: this.elements.$info,
        callback: callback
      });
    } else {
      this.subviews.info.render();
      callback();
    }
  },

  /**
   * Header.showSettings()
   * @description: Creates settings subview or renders it if it already exists
   * @param: {Function} callback
   */
  showSettings: function (callback) {
    if (!this.subviews.settings) {
      this.subviews.settings = new Settings({
        parent: this,
        el: this.elements.$settings,
        callback: callback
      });
    } else {
      this.subviews.settings.render();
      callback();
    }
  }

});
