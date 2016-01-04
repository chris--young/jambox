/**
 * public/views/nav.js
 *
 * @description: Navigation view
 * @author: Chris Young (cyoung@mobiquityinc.com)
 */

var Request = require('../../utils/request.js');

module.exports = Backbone.View.extend({

  /**
   * Nav.initialize()
   * @description: Loads view template
   * @param: {Object} options
   */
  initialize: function (options) {
    var that = this;

    _.extend(this, options);

    new Request({
      url: 'views/nav/nav.tmpl',
      callback: function (error, body) {
        if (error) {
          return that.callback(error);
        }

        that.template = _.template(body);
        that.render();
        that.$el.removeClass('hidden');
        that.listenTo(that.parent, 'route', that.setActive);
        that.callback();
      }
    });
  },

  /**
   * Nav.getElements()
   * @description: Gets DOM references
   */
  getElements: function () {
    this.elements = {
      $tooltips: $('#nav [data-toggle="tooltip"]'),
      $lis: $('#nav li'),
      $navText: $('#nav span.nav-text')
    };
  },

  /**
   * Nav.render()
   * @description: Draws the view
   */
  render: function () {
    this.$el.html(this.template());
    this.getElements();
    this.toggle();
    this.setActive();
  },

  /**
   * Nav.events
   * @description: Declares click events
   */
  events: {
    'click #nav-toggle': 'toggle'
  },

  /**
   * Nav.toggle()
   * @description: Collpases and expands the navigation view and resized the main content div
   * @param: {Object} event
   */
  toggle: function (event) {
    if (event) {
      event.preventDefault();
      this.collapsed = !this.collapsed; 
    }

    if (this.collapsed) {
      this.$el.removeClass('nav-expanded').addClass('nav-collapsed');
      this.parent.elements.$content.css('width', 'calc(100% - 57px)');
      this.elements.$tooltips.tooltip();
    } else {
      this.elements.$tooltips.tooltip('destroy');
      this.$el.removeClass('nav-collapsed').addClass('nav-expanded');
      this.parent.elements.$content.css('width', 'calc(100% - 180px)');
    }

    this.elements.$navText.css('display', 'inline');
  },

  /**
   * Nav.setActive()
   * @description: Highlights the current navigation item
   */
  setActive: function () {
    var $a = $('#nav a[href="' + window.location.hash + '"]');

    this.elements.$lis.removeClass('active');
    this.elements.$tooltips.tooltip('hide');

    if ($a.hasClass('nav-sub-level')) {
      $a.parents('li').addClass('active');
    }

    $a.parent().addClass('active');
  }

});
