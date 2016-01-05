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
 * Modal.getElements()
 * @description: Gets DOM references
 */
Modal.prototype.getElements = function () {
  this.elements = {
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
    this.getElements();

    this.elements.$title.text(this.title);
    this.elements.$message.text(this.message);

    if (this.buttons) {
      this.elements.$buttons.html('');

      _.each(this.buttons, function (button) {
        var $element = $('<button type="button">' + button.text + '</button>');
        $element.click(button.callback);
        that.elements.$buttons.append($element);
      });
    } else {
      var $button = $('<button type="button" data-dismiss="modal">Ok</button>');
      $button.click(this.callback);
      this.elements.$buttons.append($button);
    }
  } else {
    this.view.$el.html(this.view.template());
    this.view.delegateEvents();

    if (this.view.getElements) {
      this.view.getElements();
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
