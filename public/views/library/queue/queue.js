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
    _.extend(this, Backbone.Events);

    this.mp3s = this.parent.mp3s.selected(this.parent.picker.selected);

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
   * Queue.render()
   * @description: Draws the view
   */
  render: function () {
    var that = this;

    this.$el.html(this.template({
      mp3s: this.mp3s
    }));

    this.listenTo(this.parent.picker, 'change', function (event) {
      that.mp3s = that.parent.mp3s.selected(event.selected);
      that.stopListening(that.parent.picker, 'change');
      that.render();
    });
  }

});
