/**
 * public/utils/modal.js
 *
 * @description: Bootstrap modal wrapper class
 * @author: Chris Young (young.c.5690@gmail.com)
 */

function Modal(options) {
  _.extend(this, options);

  this.$el = $('#modal');
  this.$title = $('#modal-title');
  this.$message = $('#modal-message');
  this.$buttons = $('#modal-buttons');

  this.render();
}

/**
 * Modal.render()
 * @description: Shows the modal
 */
Modal.prototype.render = function () {
  var that = this;

  this.$title.text(this.title);
  this.$message.text(this.message);

  if (this.buttons) {
    this.$buttons.html('');

    _.each(this.buttons, function (button) {
      var $element = $('<button type="button">' + button.text + '</button>');
      $element.click(button.callback);
      that.$buttons.append($element);
    });
  } else {
    var $button = $('<button type="button" data-dismiss="modal">Ok</button>');
    $button.click(this.callback);
    this.$buttons.append($button);
  }

  this.$el.modal('show');
};

/**
 * Modal.close()
 * @description: Hides the modal
 */
Modal.prototype.close = function () {
  this.$el.modal('hide');
};

module.exports = Modal;
