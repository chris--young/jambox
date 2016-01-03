/**
 * public/views/library/picked/picked.js
 *
 * @description: Selected library tracks view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Picked.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    new Request({
      url: 'views/library/picked/picked.tmpl',
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
   * Picked.render()
   * @description: Draws the view
   */
  render: function () {
    this.$el.html(this.template({
      tracks: _.map(_.range(1, 13), function (index) {
        return {
          number: index,
          title: 'Etude ' + index,
          artist: 'Chopin',
          album: 'Etudes',
          length: '4:00'
        };
      })
    }));
  }

});
