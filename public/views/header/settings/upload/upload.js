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
   * Upload.getElements();
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
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
    this.elements.$uploadInput.click().on('change', _.bind(this.changeFile, this));
  },

  /**
   * Upload.changeFile()
   * @description: Starts the upload process if a file was selected
   */
  changeFile: function () {
    if (this.elements.$uploadInput.val()) {
      this.getFile();
    }
  },

  /**
   * Upload.getFile()
   * @description: Gets an uploaded file's contents
   */
  getFile: function () {
    var that = this,
        files = this.elements.$uploadInput[0].files;

    _.each(files, function (file) {
      var reader = new FileReader();

      reader.onload = function (event) {
        if (that.checkFile(event)) {
          that.uploadFile(file);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * Upload.checkFile()
   * @description: Checks that the uploaded file is an MP3
   * @param: {Object} event
   * @returns: {Boolen} true if valid MP3
   */
  checkFile: function (event) {
    var that = this,
        fileData = new Uint8Array(event.target.result);

    if (isMp3(fileData)) {
      return true;
    } else {
      if (!that.errorModal) {
        that.errorModal = new Modal({
          title: 'Error',
          message: 'One or more of the selected files are not valid MP3s.',
          buttons: [{ text: 'Ok', callback: function () { that.errorModal.close(); } }]
        });
      } else {
        that.errorModal.render();
      }
      return false;
    }
  },

  /**
   * Upload.uploadFile()
   * @description: Persists an MP3 to the server
   */
  uploadFile: function (file) {
    var that = this,
        formData = new FormData();

    formData.append('mp3', file);

    new Request({
      method: 'post',
      url: 'mp3s',
      body: formData,
      callback: function (error, response) {
        if (error) {
          return that.showResult('Error', 'The file(s) failed to upload.');
        }

        that.showResult('Info', 'The file(s) uploaded successfully.');
        that.parent.parent.parent.views.library.mp3s.add(response);
      }
    });
  },

  /**
   * Upload.showResult()
   * @description: Used to display a modal with results of upload
   * @param: {String} title
   * @param: {String} message
   */
  showResult: function (title, message) {
    var that = this;

    if (!this.resultModal) {
      this.resultModal = new Modal({
        title: title,
        message: message,
        buttons: [{ text: 'Ok', callback: function () { that.resultModal.close(); } }]
      });
    } else {
      this.resultModal.title = title;
      this.resultModal.message = message;
      this.resultModal.render();
    }
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
