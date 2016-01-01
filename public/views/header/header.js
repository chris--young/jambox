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
   * Header.setUiElements()
   * @description: Gets DOM references for view elements
   */
  setUiElements: function () {
    this.ui = {
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
    this.setUiElements();

    async.series([function (callback) {
      if (!that.controls) {
        that.controls = new Controls({
          parent: that,
          el: that.ui.$controls,
          callback: callback
        });
      } else {
        that.controls.render();
        callback();
      }
    }, function (callback) {
      if (!that.info) {
        that.info = new Info({
          parent: that,
          el: that.ui.$info,
          callback: callback
        });
      } else {
        that.info.render();
        callback();
      }
    }, function (callback) {
      if (!that.settings) {
        that.settings = new Settings({
          parent: that,
          el: that.ui.$settings,
          callback: callback
        });
      } else {
        that.settings.render();
        callback();
      }
    }], function (error) {
      if (error) {
        return that.callback(error);
      }

      that.ui.$contentWrapper.css('height', 'calc(100% - ' + that.$el.height() + 'px)');
    });
  }

});

