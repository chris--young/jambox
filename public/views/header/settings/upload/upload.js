/**
 * public/views/header/settings/upload/upload.js
 *
 * @description: File upload view
 * @author: Chris Young (young.c.5690@gmail.com)
 */

var Request = require('../../../../utils/request.js'),
    Modal = require('../../../../utils/modal.js');

module.exports = Backbone.View.extend({

  /**
   * Upload.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    new Request({
      url: 'views/header/settings/upload/upload.tmpl',
      callback: function (error, body) {
        if (error) {
          return that.callback(error);
        }

        that.template = _.template(body);
        that.modal = new Modal({ view: that });
        that.callback();
      }
    });
  },

  /**
   * Upload.setUiElements();
   * @description: Gets DOM references for view elements
   */
  setUiElements: function () {
    this.ui = {
      $uploadInput: $('#upload-input')
    };
  },

  /**
   * Upload.render()
   * @description: Draws the view in a modal
   */
  render: function () {
    this.modal.render();
  },

  /**
   * Upload.events
   * @description: Declares view click events
   */
  events: {
    'click #select-files': 'selectFiles',
    'click #cancel-upload': 'cancelUpload'
  },

  /**
   * Upload.selectFiles()
   * @description: Clicks hidden file input
   * @param: {Object} event
   */
  selectFiles: function (event) {
    this.ui.$uploadInput.click();
  },

  /**
   * Upload.cancelUpload()
   * @description: Closes the upload modal
   * @param: {Object} event
   */
  cancelUpload: function (event) {
    this.modal.close();
  }

});
