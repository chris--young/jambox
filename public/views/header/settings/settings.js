/**
 * public/views/header/settings/settings.js
 *
 * @description: Player settings view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../utils/request.js'),
    Modal = require('../../../utils/modal.js');

var Upload = require('./upload/upload.js');

module.exports = Backbone.View.extend({

  /**
   * Settings.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    this.subviews = {};

    new Request({
      url: 'views/header/settings/settings.tmpl',
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
   * Settings.getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
      $tooltips: $('#settings [data-toggle="tooltip"]'),
      $upload: $('#upload')
    };
  },

  /**
   * Settings.render()
   * @description: Draws the view
   */
  render: function () {
    this.$el.html(this.template());
    this.getElements();
    this.elements.$tooltips.tooltip();
  },

  /**
   * Settings.events
   * @description: Declares view click events
   */
  events: {
    'click #upload': 'showUpload'
  },

  /**
   * Settings.showUpload()
   * @description: Creates the upload view or renders it if it already exists 
   */
  showUpload: function (event) {
    var that = this;

    event.preventDefault();

    function showError() {
      that.modal = new Modal({
        title: 'Error',
        message: 'The upload form failed to load. Refresh to try again.',
        buttons: [
          { text: 'Close', callback: function () { that.modal.close(); } },
          { text: 'Refresh', callback: function () { history.go(0); } }
        ]
      });
    }

    if (!this.subviews.upload) {
      this.subviews.upload = new Upload({
        parent: this,
        callback: function (error) {
          if (error) {
            showError();
          }
        }
      });
    } else {
      this.subviews.upload.render();
    }
  }

});
