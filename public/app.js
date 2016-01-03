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
      this.ui = {
        $body: $('body'),
        $header: $('#header'),
        $nav: $('#nav'),
        $content: $('#content'),
        $contentWrapper: $('#content-wrapper'),
        $errorTemplate: $('#error-template'),
        $loadingTemplate: $('#loading-template')
      };

      this.errorTemplate = _.template(this.ui.$errorTemplate.html());

      Backbone.history.start();

      async.series([function (callback) {
        that.header = new Header({
          parent: that,
          el: that.ui.$header,
          callback: callback
        });
      }, function (callback) {
        that.nav = new Nav({
          parent: that,
          el: that.ui.$nav,
          callback: callback,
          router: that
        });
      }], function (error) {
        if (error) {
          that.ui.$contentWrapper.html(that.errorTemplate());
        }

        that.ui.$contentWrapper.removeClass('hidden');
        that.ui.$contentWrapper.height(that.ui.$contentWrapper.height() - that.ui.$header.height());
        
        $(window).resize(_.bind(that.resize, that));
      });
    },

    /**
     * App.resize()
     * @description: Vertically resizes content on window resize
     */
    resize: function () {
      this.ui.$contentWrapper.height(this.ui.$body.height() - this.ui.$header.height());
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
          el: this.ui.$content
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
      this.ui.$content.html(this.errorTemplate());
    }

  });

  var app = new App();

})();

