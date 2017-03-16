/**
 * Creates scoreboard from input JSON data
 */

class Scoreboard {

  _compare(a, b) {
    if (a.user < b.user)
      return -1;
    if (a.user > b.user)
      return 1;
    return 0;
  }

  static createTable(courseData, exercises, table_id) {
    courseData.sort(this._compare);

    const keys = {
      "green": 0,
      "yellow": 1,
      "red": 2,
      "gray": 3
    };

    let id = Math.random().toString(36).substring(7);

    let scoreboard = document.createElement('table');
    scoreboard.setAttribute('class', 'sortable');
    scoreboard.setAttribute('id', id);

    let head = document.createElement('thead');
    scoreboard.appendChild(head);

    let column = document.createElement('th');
    column.setAttribute('class', 'nameColumn');

    scoreboard.querySelector('thead').appendChild(column);

    for (let i in exercises) {
      let exercise = exercises[i];
      let item = document.createElement('th');
      item.setAttribute('class', 'numberHeader sortable');
      item.innerHTML = exercise.number;
      scoreboard.querySelector('thead').appendChild(item);
    }

    let body = document.createElement('tbody');
    scoreboard.appendChild(body);

    for (let j in courseData) {
      let row = document.createElement('tr');
      let student = courseData[j];
      let item = document.createElement('td');
      item.setAttribute('class', 'name');
      item.innerHTML = student.user;
      row.appendChild(item);
      for (let k in student.exercises) {
        let correct_exercise = exercises[k];
        let exercise = student.exercises.filter(function (obj) {
          return obj.id == correct_exercise.id;
        });
        let mark = document.createElement('td');
        mark.setAttribute('id', 'status');
        mark.setAttribute('sorttable_customkey', keys[exercise[0].status]);
        let color = document.createElement('div');
        color.setAttribute('class', exercise[0].status);
        color.setAttribute('data-toggle', 'tooltip');
        color.setAttribute('title', `${student.user} - ${correct_exercise.number}`);
        mark.appendChild(color);
        row.appendChild(mark);
      }
      scoreboard.querySelector('tbody').appendChild(row);
    }

    console.log(scoreboard);

    $('div[id=checkmarkTable' + table_id + ']').html(scoreboard);

    let alertID = "#loadingAlert" + courseData.coursekey;
    $(alertID).hide();

    $('[data-toggle="tooltip"]').tooltip();

    // make table sortable
    let nto = document.getElementById(id);
    sorttable.makeSortable(nto);
  }

  getPageData(course_id) {
    // Using jQuery AJAX because backend.js can only communicate with backend URL
    return $.ajax({
      url : FRONTEND_BASE_URL + `kurssit/${course_id}/print.html`,
      success : function(result){
        return result;
      },
      error: function() {
        console.warn("Could not retrieve course page");
      }
    });
  }

  static getExerciseNumbers(pageData) {
    // Match either chapter number or exercise ID
    const regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    let regex_array = regex.exec(pageData);

    // Initialize variables
    let exercises = [];
    let chapterNumber = 0;
    let exerciseCounter = 1;

    // While matches are found
    while (regex_array != null) {
      if (regex_array[1] == null) {
        exercises.push({
          id: regex_array[2],
          number: chapterNumber + "." + exerciseCounter
        });
        exerciseCounter++;
      } else if (regex_array[2] == null) {
        chapterNumber = regex_array[1];
        exerciseCounter = 1;
      }
      regex_array = regex.exec(pageData);
    }
    return exercises;
  }

  static createScoreboard(pageData, data) {
    let exercises = this.getExerciseNumbers(pageData);
    this.createTable(data.students, exercises, data.coursekey);

  }

  init(data, key) {
    let course = {};
    for (let i in data) {
      let c = data[i];
      if (c.coursekey == key) {
        course = c;
      }
    }

    this.getPageData(course.html_id)
      .then(
        function fulfilled(pageData) {
          backend.get(`courses/${course.id}/scoreboard`)
            .then(
              function fulfilled(data) {
                Scoreboard.createScoreboard(pageData, data);
              },
              function rejected() {
                console.warn("Could not get scoreboard.");
              }
            );
        },
        function rejected() {

        }
      );
  }

}
