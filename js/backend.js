/**
 * Backend class for handling all GET and POST requests to the server
 */

class Backend {

  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Performs a GET request to a specified URL
   * @param  {String} url RESTful URL (without the base URL)
   * @return {JSON} Server response
   */
  get(url) {
    const baseURL = this.baseURL;
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', baseURL + url, true);
      request.withCredentials = true;
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          resolve(JSON.parse(request.responseText));
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
   * @return {[type]}      [description]
   */
  post(url, data) {
    const baseURL = this.baseURL;
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', baseURL + url, true);
      request.withCredentials = true;

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject(JSON.parse(request));
        }
      };
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send(JSON.stringify(data));
    });
  }
}
