FRONTEND_BASE_URL = 'http://localhost:4000/';
BACKEND_BASE_URL = 'https://pure-inlet-98383.herokuapp.com/';

function getQueryVariable(variable) {
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

function getPageData(course_id) {
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

function getData(id, html_id) {
  let course = {
    coursekey: "testiavain3"
  };

  let url = `courses/${id}/scoreboard`;

  getPageData(html_id)
    .then(
      function fulfilled(pageData) {
        backend.get(url)
          .then(
            function fulfilled(data) {
              Scoreboard.createScoreboard(pageData, data, course);
            },
            function rejected(data) {
              console.log(course.coursekey);
              $(`#loadingAlert${course.coursekey}`).removeClass('alert-info').addClass('alert-danger');
              $(`#loadingAlert${course.coursekey} strong`).html('Virhe! Tulostaulua ei pystytty lataamaan.');
              console.warn(data + ": Could not get scoreboard.");
            }
          );
      },
      function rejected() {

      }
    );
}

let id = getQueryVariable('id');
let html_id = getQueryVariable('html_id');
let coursekey = getQueryVariable('coursekey');
$('.scoreboard').attr("id", `checkmarkTable${coursekey}`);
$('.alert').attr('id', `loadingAlert${coursekey}`);
let backend = new Backend();
let view = new View();

$(document).ready(function() {
  getData(id, html_id);
});