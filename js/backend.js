/**
 * Backend class for handling all GET and POST requests to the server
 */

class Backend {
  /**
   * Performs a GET request to a specified URL
   * @param  {String} url RESTful URL (without the base URL)
   * @return {Promise} Promise
   */
  get(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', BACKEND_BASE_URL + url, true);
      request.withCredentials = true;
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          Session.renew();
          resolve(JSON.parse(request.responseText));
        } else if (request.status === 404) {
          reject('404');
        } else {
          reject(JSON.parse(request.responseText).error);
        }
      };
      request.send();
    });
  }

  /**
   * Performs a POST request to a specified URL
   * @param  {String} url  RESTful URL (without the base URL)
   * @param  {Object} data Data to be sent
   * @return {Promise} Promise
   */
  post(url, data) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', BACKEND_BASE_URL + url, true);
      request.withCredentials = true;

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          Session.renew();
          resolve(JSON.parse(request.responseText));
        } else {
          reject(JSON.parse(request.responseText));
        }
      };
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send(JSON.stringify(data));
    });
  }

  /**
   * Performs a DELETE request to a specified URL
   * @param  {String} url RESTful URL (without the base URL)
   * @return {Promise} Promise
   */
  delete(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('DELETE', BACKEND_BASE_URL + url, true);
      request.withCredentials = true;

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject(JSON.parse(request.responseText));
        }
      };
      request.send();
    });
  }
}
