if (typeof HTMLDocument !== 'undefined') {
  HTMLDocument.prototype.getCookie = function(key) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + key + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  };
  HTMLDocument.prototype.deleteCookie = function(key) {
    document.cookie = key + '=; path=/; expires=' + new Date(0).toUTCString();
  };
} else {
  /**
   * @param {String} key - Get cookie by value.
   */
  Document.prototype.getCookie = function(key) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + key + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  };
  /**
   *
   * @param {String} key - Destroy cookie by value.
   */
  Document.prototype.deleteCookie = function(key) {
    document.cookie = key + '=; path=/; expires=' + new Date(0).toUTCString();
  };
}

let temp_backend_base_url;
let temp_frontend_base_url;

if (document.domain == "localhost" || document.domain == "127.0.0.1") {
  //temp_backend_base_url = "http://kurssihallinta.kisallioppiminen.fi/";
  temp_backend_base_url = "https://pure-inlet-98383.herokuapp.com/";
  temp_frontend_base_url = "http://localhost:4000/";
} else if (document.domain == "ohtukisalli.github.io") {
  //temp_backend_base_url = "http://kurssihallinta.kisallioppiminen.fi/";
  temp_backend_base_url = "https://pure-inlet-98383.herokuapp.com/";
  temp_frontend_base_url = "https://ohtukisalli.github.io/";
//if in production
} else if (document.domain == "beta-kisallioppiminen.github.io") {
  temp_backend_base_url = "https://kurssihallinta.kisallioppiminen.fi/";
  temp_frontend_base_url = "https://beta-kisallioppiminen.github.io/";
} else {
}

const BACKEND_BASE_URL = temp_backend_base_url;
const FRONTEND_BASE_URL = temp_frontend_base_url;
