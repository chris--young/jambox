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
      Home = require('./views/home/home.js');

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
      '': 'redirectToHome',
      'home': 'home'
    },

    /**
     * App.redirectToHome()
     * @description: Redirect to the home view when no page is specified
     */
    redirectToHome: function () {
      window.location.replace('#/home');
    },

    /**
     * App.home()
     * @description: Creates the home view or renders it if it already exists
     */
    home: function () {
      if (!this.views.home) {
        this.views.home = new Home({
          parent: this,
          el: this.ui.$content
        });
      } else {
        this.views.home.render();
      }
    }

  });

  var app = new App();

})();
