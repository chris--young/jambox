/**
 * public/app.js
 *
 * @description: Main frontend script
 * @author: Chris Young (young.c.5690@gmail.com)
 */

(function () {

  'use strict';

  var Header = require('./views/header/header.js'),
      Nav = require('./views/nav/nav.js'),
      Library = require('./views/library/library.js');

  var App = Backbone.Router.extend({

    /**
     * App.initialize()
     * @description: Sets up the application
     */
    initialize: function () {
      var that = this;

      this.views = {};
      this.getElements();
      this.templates = {
        error: _.template(this.elements.$errorTemplate.html()),
        loading: _.template(this.elements.$loadingTemplate.html())
      };

      Backbone.history.start();

      async.series([_.bind(this.renderHeader, this), _.bind(this.renderNav, this)], _.bind(this.showContent, this));
    },

    /**
     * App.renderHeader()
     * @description: Creates the header view
     * @param: {Function} callback
     */
    renderHeader: function (callback) {
      this.views.header = new Header({
        parent: this,
        el: this.elements.$header,
        callback: callback
      });
    },

    /**
     * App.renderNav()
     * @description: Creates the nav view
     * @param: {Function} callback
     */
    renderNav: function (callback) {
      this.views.nav = new Nav({
        parent: this,
        el: this.elements.$nav,
        callback: callback
      });
    },

    /**
     * App.getElements()
     * @description: Gets DOM references
     */
    getElements: function () {
      this.elements = {
        $body: $('body'),
        $header: $('#header'),
        $nav: $('#nav'),
        $content: $('#content'),
        $contentWrapper: $('#content-wrapper'),
        $errorTemplate: $('#error-template'),
        $loadingTemplate: $('#loading-template')
      };
    },

    /**
     * App.showContent()
     * @description: Displays app main content or error if initialization failed
     * @param: {Object} error
     */
    showContent: function (error) {
      if (error) {
        this.elements.$contentWrapper.html(this.templates.error());
        console.log('App.showContent() error:', error);
      }

      this.elements.$contentWrapper.removeClass('hidden');
      this.elements.$contentWrapper.height(this.elements.$contentWrapper.height() - this.elements.$header.height());

      $(window).resize(_.bind(this.resize, this));
    },

    /**
     * App.resize()
     * @description: Vertically resizes content on window resize
     */
    resize: function () {
      this.elements.$contentWrapper.height(this.elements.$body.height() - this.elements.$header.height());
    },

    /**
     * App.routes
     * @description: Declares app view routing
     */
    routes: {
      '': 'redirectToLibrary',
      'library': 'library',
      '*notfound': 'notFound'
    },

    /**
     * App.redirectToHome()
     * @description: Redirect to the library view when no page is specified
     */
    redirectToHome: function () {
      window.location.replace('#/library');
    },

    /**
     * App.library()
     * @description: Creates the home view or renders it if it already exists
     */
    library: function () {
      if (!this.views.library) {
        this.views.library = new Library({
          parent: this,
          el: this.elements.$content
        });
      } else {
        this.views.library.render();
      }
    },

    /**
     * App.notFound()
     * @description: Displays an error for unknown routes
     */
    notFound: function () {
      this.elements.$content.html(this.templates.error());
    }

  });

  var app = new App();
  console.log('app', app);

})();

