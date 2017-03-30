/**
 * Creates scoreboard from input JSON data
 */

class Scoreboard {

  static _compare(a, b) {
    if (a.user < b.user)
      return -1;
    if (a.user > b.user)
      return 1;
    return 0;
  }

  static getFullScreenLink(id, html_id, coursekey) {
    return `scoreboard.html?id=${encodeURIComponent(id)}&html_id=${encodeURIComponent(html_id)}&coursekey=${coursekey}`;
  }

  static createTable(courseData, exercises, table_id, course) {
    courseData.sort(Scoreboard._compare);

    const keys = {
      "green": 0,
      "yellow": 1,
      "red": 2,
      "gray": 3
    };

    let id = Math.random().toString(36).substring(7);

    let scoreboard = view.createScoreboardFrame(id);

    for (let i in exercises) {
      let item = view.createExercise(exercises[i].number);
      scoreboard.querySelector('tr').appendChild(item);
    }

    //let body = document.createElement('tbody');
    //scoreboard.appendChild(body);

    for (let j in courseData) {      
      let student = courseData[j];
      let row = view.createName(student.user);

      for (let k in student.exercises) {
        let correctExercise = exercises[k];
        let exercise = student.exercises.filter(function (obj) {
          return obj.id == correctExercise.id;
        });
        let checkmark = view.createCheckmark(keys[exercise[0].status], exercise[0].status, student.user, correctExercise.number);
        row.appendChild(checkmark);
      }
      scoreboard.querySelector('tbody').appendChild(row);
    }

    $('div[id=checkmarkTable' + table_id + ']').html(scoreboard);

    if (window.location.pathname.includes("/kurssihallinta.html")) {
      let fullScreenLink = Scoreboard.getFullScreenLink(course.id, course.html_id, course.coursekey);
      $('div[id=checkmarkTable' + table_id + ']').prepend(view.createFullScreenButton('id', fullScreenLink));
    } else {
      $('div[id=checkmarkTable' + table_id + ']').prepend(view.createCloseButton());
    }

    let alertID = "#loadingAlert" + table_id;
    $(alertID).hide();

    $('[data-toggle="tooltip"]').tooltip();

    // make table sortable
    if (table_id.length > 1) {
      console.log(id);
      let nto = document.getElementById(id);
      console.log(nto);
      sorttable.makeSortable(nto);
    }
  }

  getPageData(course_id) {
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

  static createScoreboard(pageData, data, course) {
    let exercises = Exercises.extractExercises(pageData);
    if (data.exercises) {
      let studentData = [{
        user: session.getUserFirstName(),
        exercises: data.exercises
      }];
      this.createTable(studentData, exercises, data.coursekey, course);
    } else {
      this.createTable(data.students, exercises, data.coursekey, course);
    }
  }

  init(data, key) {
    let course = {};
    for (let i in data) {
      let c = data[i];
      if (c.coursekey == key) {
        course = c;
      }
    }

    let url = `courses/${course.id}/scoreboard`;

    if (window.location.pathname.includes("/omat_kurssit")) {
      url = `students/${session.getUserId()}/courses/${course.id}/scoreboard`;
    }

    this.getPageData(course.html_id)
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

}
