/**
 * public/views/library/picker/picker.js
 *
 * @description: Track picker view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Picker.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);
    _.extend(this, Backbone.Events);

    this.selected = {
      album: 'All',
      artist: 'All',
      genera: 'All'
    };

    new Request({
      url: 'views/library/picker/picker.tmpl',
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
   * Picker.render()
   * @description: Draws the view
   */
  render: function () {
    this.$el.html(this.template({
      albums: this.parent.mp3s.albums(this.selected.album),
      artists: this.parent.mp3s.artists(this.selected.artists),
      generas: this.parent.mp3s.generas(this.selected.generas),
      selected: this.selected
    }));
  },

  /**
   * Picker.events
   * @description: Declares view click events
   */
  events: {
    'click ol.picker-category a': 'select'
  },

  /**
   * Picker.select()
   * @description: Updates picker selection
   * @param: {Object} event
   */
  select: function (event) {
    var $target = $(event.target),
        selected = $target.text(),
        category = $target.parents('ol.picker-category').data('category');

    event.preventDefault();

    if (this.selected[category] === selected) {
      return;
    }

    this.selected[category] = selected;

    switch (category) {
      case 'artist':
        this.selected.album = 'All';
        break;
      case 'genera':
        this.selected.album = 'All';
        this.selected.artist = 'All';
        break;
      default:
        break;
    }

    this.render();
    this.trigger('change', { selected: this.selected });
  }

});
