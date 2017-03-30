const FRONTEND_BASE_URL = 'http://localhost:4000/';
const BACKEND_BASE_URL = 'https://pure-inlet-98383.herokuapp.com/';
let backend;
let view;
let id;
let html_id;
let coursekey;

class Fullscreen {

  static getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  }

  static getPageData(course_id) {
    // Using jQuery AJAX because backend.js can only communicate with backend URL
    return $.ajax({
      url: FRONTEND_BASE_URL + `kurssit/${course_id}/print.html`,
      success: function (result) {
        return result;
      },
      error: function () {
        console.warn("Could not retrieve course page");
      }
    });
  }

  static showError() {
    $(`#loadingAlert${coursekey}`).removeClass('alert-info').addClass('alert-danger');
    $(`#loadingAlert${coursekey} strong`).html('Virhe! Tulostaulua ei pystytty lataamaan.');
  }

  static getData(id, html_id) {
    let url = `courses/${id}/scoreboard`;

    if (id.length === false || html_id.length === false || coursekey.length === false) {
      Fullscreen.showError();
    } else {
      Fullscreen.getPageData(html_id)
        .then(
          function fulfilled(pageData) {
            backend.get(url)
              .then(
                function fulfilled(data) {
                  Scoreboard.createScoreboard(pageData, data, data.coursekey);
                },
                function rejected(data) {
                  console.log("Virhe");
                  $(`#loadingAlert${coursekey}`).removeClass('alert-info').addClass('alert-danger');
                  $(`#loadingAlert${coursekey} strong`).html('Virhe! Tulostaulua ei pystytty lataamaan.');
                  console.warn(data + ": Could not get scoreboard.");
                }
              );
          },
          function rejected() {
            console.warn("Error");
          }
        );
    }
  }

  static init() {
    id = Fullscreen.getQueryVariable('id');
    html_id = Fullscreen.getQueryVariable('html_id');
    coursekey = Fullscreen.getQueryVariable('coursekey');
    $('.scoreboard').attr("id", `checkmarkTable${coursekey}`);
    $('.alert').attr('id', `loadingAlert${coursekey}`);
    backend = new Backend();
    view = new View();
    Fullscreen.getData(id, html_id);
  }
}



$(document).ready(function () {
  Fullscreen.init();
});
