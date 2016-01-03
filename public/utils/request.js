/**
 * public/utils/request.js
 *
 * @description: Fetch wrapper class with automatic error handling
 * @author: Chris Young (young.c.5690@gmail.com)
 */

/**
 * Request()
 * @description: Creates a new Request object and makes an ajax request
 * @param: {Object} options
 */
function Request(options) {
  _.extend(this, options);

  this.fetch();
}

/**
 * Request.fetch()
 * @description: Makes an ajax request using fetch
 */
Request.prototype.fetch = function () {
  var that = this;

  /**
   * checkStatus()
   * @description: Breaks the promise chain if response is non-200
   * @param: {Object} response
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    throw {
      statusText: response.statusText,
      response: response
    };
  }

  fetch(this.url, {
    method: this.method || 'get',
    headers: this.headers,
    body: this.body
  }).then(checkStatus)
    .then(function (response) {
      if (response.status === 204) {
        return;
      }

      if (~response.headers.get('Content-Type').indexOf('application/json')) {
        return response.json();
      }

      return response.text();
    }).then(function (body) {
      return that.callback(null, body);
    }).catch(function (error) {
      if (error.response && error.response.status === 204) {
        return that.callback();
      }

      return that.callback(error);
    });
};

module.exports = Request;
