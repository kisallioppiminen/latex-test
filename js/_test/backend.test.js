describe('Backend class', function () {

  let backend;

  beforeEach(function (done) {
    setTimeout(function () {

      class Backend {
        get(url) {
          return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.withCredentials = true;
            request.onload = () => {
              if (request.status >= 200 && request.status < 400) {
                console.warn(JSON.parse(request.responseText));
                resolve(JSON.parse(request.responseText));
                done();
              } else if (request.status === 404) {
                reject('404');
              } else {
                reject(JSON.parse(request.responseText).error);
              }
            };
            request.send();
          });
        }
      }

      done();
    }, 2000);
  });

  it('should send GET request', function () {
    backend = new Backend();
    let message = '';

    backend.get('https://gist.githubusercontent.com/anonymous/af20378f182ce6a02dcfded730ef3887/raw/4cc5b1e9dd24c485722ebdf3674a2fdf234b8d5a/hello.json')
      .then(
        function fulfilled(data) {
          console.warn(data);
        }
      );

    done();
    console.warn("hehe");
  });

});
