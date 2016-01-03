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
   * @description: Clicks hidden file input and sets change event
   * @param: {Object} event
   */
  selectFiles: function (event) {
    this.ui.$uploadInput.click().on('change', _.bind(this.changeFile, this));
  },

  /**
   * Upload.changeFile()
   * @description: Starts the upload process if a file was selected
   */
  changeFile: function () {
    var filePath = this.ui.$uploadInput.val();

    if (!filePath) {
      return;
    }

    this.getFileData();
  },

  /**
   * Upload.getFileData()
   * @description: Gets uploaded file's contents and checks for validity
   */
  getFileData: function () {
    var that = this,
        files = this.ui.$uploadInput[0].files,
        reader = new FileReader();

    function load() {
      return function (event) {
        var valid = isMp3(new Uint8Array(event.target.result));

        if (valid) {
          that.uploadFile();
        } else {
          that.errorModal = new Modal({
            title: 'Error',
            message: 'The selected file is not a valid MP3.',
            buttons: [{ text: 'Ok', callback: function () { that.errorModal.close(); } }]
          });
        }
      };
    }

    _.each(files, function (file) {
      reader.onload = load();
      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * Upload.uploadFile()
   * @description: Persists a file to the server
   */
  uploadFile: function () {
    var that = this;

    function showModal(title, message) {
      that.resultModal = new Modal({
        title: title,
        message: message,
        buttons: [{ text: 'Ok', callback: function () { that.resultModal.close(); } }]
      });
    }

    var formData = new FormData(document.querySelector('#upload-form'));

    new Request({
      method: 'post',
      url: 'mp3s',
      body: formData,
      callback: function (error, response) {
        if (error) {
          return showModal('Error', 'The file failed to upload.');
        }

        showModal('Info', 'The file uploaded successfully.');

        console.log('uploadFile() response ==', response);
      }
    });
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
