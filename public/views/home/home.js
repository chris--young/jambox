/**
 * public/views/home/home.js
 *
 * @description: Home view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Home.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    this.errorTemplate = _.template(this.parent.ui.$errorTemplate.html());
    this.loadingTemplate = _.template(this.parent.ui.$loadingTemplate.html());

    new Request({
      url: 'views/home/home.tmpl',
      callback: function (error, body) {
        if (!error) {
          that.template = _.template(body);
        }

        that.render();
      }
    });
  },

  /**
   * Home.render()
   * @description: Draws the view
   */
  render: function () {
    if (!this.template) {
      return this.$el.html(this.errorTemplate());
    }

    this.$el.html(this.template());
  }

});
