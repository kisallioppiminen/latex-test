if (typeof HTMLDocument !== 'undefined') {
    HTMLDocument.prototype.getCookie = function(key) {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + key + '=');
      if (parts.length == 2) return parts.pop().split(';').shift();
    }
    HTMLDocument.prototype.deleteCookie = function(key) {
      document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
} else {
  /**
   * @param {String} key - Get cookie by value.
   */
    Document.prototype.getCookie = function(key) {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + key + '=');
      if (parts.length == 2) return parts.pop().split(';').shift();
    }
    /**
     *
     * @param {String} key - Destroy cookie by value.
     */
    Document.prototype.deleteCookie = function(key) {
      document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
