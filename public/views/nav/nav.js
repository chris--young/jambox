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
        that.listenTo(that.router, 'route', that.setActive);
        that.callback();
      }
    });
  },

  /**
   * Nav.setUiElements()
   * @description: Gets DOM references for view elements
   */
  setUiElements: function () {
    this.ui = {
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
    this.setUiElements();
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
      this.parent.ui.$content.css('width', 'calc(100% - 57px)');
      this.ui.$tooltips.tooltip();
    } else {
      this.ui.$tooltips.tooltip('destroy');
      this.$el.removeClass('nav-collapsed').addClass('nav-expanded');
      this.parent.ui.$content.css('width', 'calc(100% - 180px)');
    }

    this.ui.$navText.css('display', 'inline');
  },

  /**
   * Nav.setActive()
   * @description: Highlights the current navigation item
   */
  setActive: function () {
    var $a = $('#nav a[href="' + window.location.hash + '"]');

    this.ui.$lis.removeClass('active');
    this.ui.$tooltips.tooltip('hide');

    if ($a.hasClass('nav-sub-level')) {
      $a.parents('li').addClass('active');
    }

    $a.parent().addClass('active');
  }

});
