/**
 * public/utils/modal.js
 *
 * @description: Bootstrap modal wrapper class
 * @author: Chris Young (young.c.5690@gmail.com)
 */

function Modal(options) {
  _.extend(this, options);

  this.$modal = $('#modal');

  if (!this.view) {
    this.template = _.template($('#modal-template').html());
    this.$el = $('#modal div.modal-dialog');
  } else {
    this.view.$el = $('#modal div.modal-dialog');
  }

  this.render();
}

/**
 * Modal.setUiElements()
 * @description: Gets DOM references for view elements
 */
Modal.prototype.setUiElements = function () {
  this.ui = {
    $title: $('#modal-title'),
    $message: $('#modal-message'),
    $buttons: $('#modal-buttons')
  };
};

/**
 * Modal.render()
 * @description: Shows the modal
 */
Modal.prototype.render = function () {
  var that = this;

  if (!this.view) {
    this.$el.html(this.template());
    this.setUiElements();

    this.ui.$title.text(this.title);
    this.ui.$message.text(this.message);

    if (this.buttons) {
      this.ui.$buttons.html('');

      _.each(this.buttons, function (button) {
        var $element = $('<button type="button">' + button.text + '</button>');
        $element.click(button.callback);
        that.ui.$buttons.append($element);
      });
    } else {
      var $button = $('<button type="button" data-dismiss="modal">Ok</button>');
      $button.click(this.callback);
      this.ui.$buttons.append($button);
    }
  } else {
    this.view.$el.html(this.view.template());
    this.view.delegateEvents();

    if (this.view.setUiElements) {
      this.view.setUiElements();
    }
  }

  this.$modal.modal('show');
};

/**
 * Modal.close()
 * @description: Hides the modal
 */
Modal.prototype.close = function () {
  this.$modal.modal('hide');
};

module.exports = Modal;

