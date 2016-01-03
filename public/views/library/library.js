/**
 * public/views/library/library.js
 *
 * @description: Music library view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../utils/request.js');

var Picker = require('./picker/picker.js'),
    Picked = require('./picked/picked.js');

module.exports = Backbone.View.extend({

  /**
   * Library.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    this.errorTemplate = _.template(this.parent.ui.$errorTemplate.html());
    this.loadingTemplate = _.template(this.parent.ui.$loadingTemplate.html());

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
   * Library.setUiElements()
   * @description: Gets DOM references for view elements
   */
  setUiElements: function () {
    this.ui = {
      $picker: $('#picker'),
      $picked: $('#picked')
    };
  },

  /**
   * Library.render()
   * @description: Draws the view
   */
  render: function () {
    var that = this;

    if (!this.template) {
      return this.$el.html(this.errorTemplate());
    }

    this.$el.html(this.template());
    this.setUiElements();

    async.series([function (callback) {
      if (!that.picker) {
        that.picker = new Picker({
          parent: that,
          el: that.ui.$picker,
          callback: callback
        });
      } else {
        that.picker.render();
        callback();
      }
    }, function (callback) {
      if (!that.picked) {
        that.picked = new Picked({
          parent: that,
          el: that.ui.$picked,
          callback: callback
        });
      } else {
        that.picked.render();
        callback();
      }
    }], function (error) {
      if (error) {
        return that.$el.html(that.errorTemplate());
      }
    });
  }

});
