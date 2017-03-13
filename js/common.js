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

console.log("In environment settings");
console.log("domain:");
console.log(document.domain);
//if in localhost
if (document.domain == "localhost") {
    console.log("settign local urls!")
    const BACKEND_BASE_URL = "http://localhost:3000/";
    const FRONTEND_BASE_URL = "http://localhost:4000/";
    console.log(BACKEND_BASE_URL);
} else if (document.domain == "ohtukisalli.github.io") {
    console.log("Running in: " + document.domain);
    const BACKEND_BASE_URL = "https://pure-inlet-98383.herokuapp.com/";
    const FRONTEND_BASE_URL = "https://ohtukisalli.github.io/dev-frontend/";
//if in production
} else if (document.domain == "beta.kisallioppiminen.fi") {
    console.log("Running in: " + document.domain);
    const BACKEND_BASE_URL = "https://pure-inlet-98383.herokuapp.com/";
    const FRONTEND_BASE_URL = "https://ohtukisalli.github.io/";
} else {
console.log("ERROR: cannot set BACKEND_BASE_URL and FRONTEND_BASE_URL. Domain changed?");
}