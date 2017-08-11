/**
 * Creates scoreboard from input JSON data
 */

class Scoreboard {

  static getFullScreenLink(id, html_id, coursekey) {
    return `scoreboard.html?id=${encodeURIComponent(id)}&html_id=${encodeURIComponent(html_id)}&coursekey=${coursekey}`;
  }

  static createTable(courseData, exercises, table_id, course) {
    const keys = {
      "green": 0,
      "yellow": 1,
      "red": 2,
      "gray": 3
    };

    const scheduleColors = ['#ffffff', '#da9887', '#87b2da', '#c4da87', '#f9bb81', '#eae981'];

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
        if (exercise.length === 1) {
          let checkmark;
          if(student.color === undefined) {
            checkmark = view.createCheckmark(keys[exercise[0].status], exercise[0].status, student.user, correctExercise.number);            
          } else {
            checkmark = view.createScheduleMark(scheduleColors[student.color], exercise[0].status, student.user, correctExercise.number);
          }
          row.appendChild(checkmark);
        } else {
          let checkmark = view.createCheckmark(3, 'gray', student.user, correctExercise.number);
          row.appendChild(checkmark);          
        }
      }
      if (student.color != undefined) {
        scoreboard.querySelector('tfoot').appendChild(row);
      } else {
        scoreboard.querySelector('tbody').appendChild(row);        
      }
    }

    $('div[id=checkmarkTable' + table_id + ']').html(scoreboard);

    if (window.location.pathname.includes("/kurssihallinta.html")) {
      let fullScreenLink = Scoreboard.getFullScreenLink(course.id, course.html_id, course.coursekey);
      $('div[id=checkmarkTable' + table_id + ']').prepend(view.createFullScreenButton('id', fullScreenLink));
    } else {
      if (!window.location.pathname.includes("/omat_kurssit.html")) {
        $('div[id=checkmarkTable' + table_id + ']').prepend(view.createCloseButton());
      }    
    }

    let alertID = "#loadingAlert" + table_id;
    $(alertID).hide();

    $('[data-toggle="tooltip"]').tooltip();
    
    // make table sortable
    if (table_id.length > 1 && courseData.length > 1 && !window.location.pathname.includes('/omat_kurssit.html')) {
      let nto = document.getElementById(id);
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
    this.createTable(data.students, exercises, data.coursekey, course);
  }

  static validateScoreboardData(data) {
    let amount = [];
    for (let i in data.students) {
      let item = data.students[i];
      amount.push(item.exercises.length);
    }
    return amount.every( (val, i, arr) => val == arr[0] );
  }

  static displayError(course, data) {
    $(`#loadingAlert${course.coursekey}`).removeClass('alert-info').addClass('alert-danger');
    $(`#loadingAlert${course.coursekey} strong`).html('Virhe! Tulostaulua ei pystytty lataamaan.');
    console.warn(data + ": Could not get scoreboard.");
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
      url = `students/${Session.getUserId()}/courses/${course.id}/scoreboard`;
    }

    this.getPageData(course.html_id)
      .then(
        function fulfilled(pageData) {
          backend.get(url)
            .then(
              function fulfilled(data) {
                if (Scoreboard.validateScoreboardData(data)) {
                  Scoreboard.createScoreboard(pageData, data, course);                  
                } else {
                  Scoreboard.displayError(course, data);
                }
              },
              function rejected(data) {
                Scoreboard.displayError(course, data);
              }
            );
        },
        function rejected() {

        }
      );
  }

}
