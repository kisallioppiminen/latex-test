let button;

class Button {

  constructor() {
    this.courseData = {
      coursekey: '',
      course_id: '',
      data: []
    };
  }

  /**
   * Changes header color based on the color ID
   * @param  {String} id Color ID
   */
  _changeProblemHeaderColor(id) {
    const obj = this;
    const problemID = id.substr(2, id.length - 1);

    // RGB values for red, yellow and green
    const colors = ["rgb(217, 83, 79)", "rgb(240, 173, 78)", "rgb(92, 184, 92)"];
    const color = colors[id.charAt(0)];

    const header_id = 'div[id="' + problemID + '"]';

    // Fallback to default gray if same button is pressed again
    if ($(header_id + " header").css("background").includes(color)) {
      $(header_id + " header").attr("style", "");
      const text_id = 'h3[id="textbar_' + id.substr(2, id.length - 1) + '"]';
      obj.sendCheckmark(`3;${problemID}`);
      // Restore text
      $(text_id).html("Miten tehtävä meni?");
    } else {
      $(header_id + " header").css({ "background": color });
    }
  }

  /**
   * Adds button group to each exercise
   */
  _addButtons() {
    const obj = this;
    $(".tehtava").each(function (index, value) {
      const id = this.id;

      let buttonDiv = view.createButtonDiv(id);
      let buttonGroup = view.createButtonGroup();
      buttonGroup.appendChild(view.createButton(0, id));
      buttonGroup.appendChild(view.createButton(1, id));
      buttonGroup.appendChild(view.createButton(2, id));
      buttonDiv.appendChild(buttonGroup);

      $(value).find("div:nth-child(2):last-child").append(buttonDiv);

    });

    // Add listener
    $('.problemButton').click(function () {
      obj.sendCheckmark(this.id);
    });
  }

  /**
   * Returns integer based on input color
   * @param status {String} color (red, yellow, green)
   * @returns {Integer} (0: red, 1: yellow, 2: green)
   */
  _getColorID(status) {
    const colors = { "red": 0, "yellow": 1, "green": 2 };
    return colors[status];
  }

  /**
   * Colors headers for exercises student has already submitted
   * @param jsonData
   */
  _colorCheckmarks(jsonData) {
    for (let i in jsonData.exercises) {
      const exercise = jsonData.exercises[i];
      if ($('div[id="' + exercise.id + '"]').length && exercise.status !== 'gray') {
        this._changeProblemHeaderColor(this._getColorID(exercise.status) + ";" + exercise.id);
      }
    }
  }

  /**
   * Returns current course html_id
   * @returns {String} for example 'may1'
   */
  _getHTMLID(path) {
    const regexp = /(?:kurssit\/)([a-z0-9]+)(?:\/)/g;
    return regexp.exec(path)[1];
  }

  /**
   * Extracts course key and course id and sets them as global variables
   * @param data
   * @returns {*|Document.coursekey}
   */
  _extractCourseData(data, path) {
    const html_id = path;
    for (let i in data) {
      if (data[i].html_id == html_id) {
        this.courseData.coursekey = data[i].coursekey;
        this.courseData.course_id = data[i].id;
        break;
      }
    }
  }

  /**
   * Requests student's checkmarks and proceeds to color them if request is successful.
   */
  _getCheckmarks() {
    const obj = this;
    const restfulUrl = `students/${Session.getUserId()}/courses/${this.courseData.course_id}/checkmarks`;

    backend.get(restfulUrl)
      .then(
        function fulfilled(data) {
          obj._colorCheckmarks(data);
        },
        function rejected(data) {
          console.warn("Could not retrieve checkmarks. Message: " + JSON.parse(data.responseText).error);
        }
      );
  }

  /**
   * Changes button title text
   * @param id {String} exercise ID, for example 'e56f54a7-3619-4cf8-bb6c-00ab8243b818'
   * @param message {String} message to be displayed
   */
  _changeButtonTitleText(id, message) {
    const text_id = `h3[id="textbar_${id}"]`;
    $(text_id).html(message);
  }

  sendCheckmark(id) {
    const obj = this;
    const stats = ["red", "yellow", "green", "gray"];

    const checkmark = {
      html_id: id.substr(2, id.length - 1),
      status: stats[id.charAt(0)],
      coursekey: obj.courseData.coursekey
    };

    backend.post('checkmarks', checkmark)
      .then(
        function fulfilled() {
          if (checkmark.status !== 'gray') {
            obj._changeButtonTitleText(id.substr(2, id.length - 1), "Vastauksesi on lähetetty!");
            obj._changeProblemHeaderColor(id);
          }
        },
        function rejected(data) {
          obj._changeButtonTitleText(id.substr(2, id.length - 1), "Virhe! " + data.error);
        }
      );
  }

  /**
   * Init function
   * @param  {Obj} data Course data in JSON
   */
  init(data) {
    this._extractCourseData(data, this._getHTMLID(window.location.pathname));
    if (this.courseData.coursekey !== '') {
      this._addButtons();
      this._getCheckmarks();
    } else {
      console.warn("No coursekey for this material.");
    }
  }

  /**
   * Displays a modal window so that the teacher can select which course statistics they wish to see.
   * @param  {String} htmlID Course HTML ID
   * @param  {Array} keys   Course IDs
   * @param  {Obj} data   Course data
   */
  _invokeCourseSelect(htmlID, keys, data) {
    let obj = this;
    $('#courseSelectModalTitle').html(`Opetat useampaa ${htmlID.toUpperCase()}-kurssia. Valitse listalta mitä kurssisuorituksia haluat katsoa.`);
    $('#courseSelect').empty();
    for (let i in keys) {
      $('#courseSelect').append(`<option value="${keys[i]}">${htmlID.toUpperCase()} - ${keys[i]}</option>`);
    }
    $('#courseSelectModal').modal('toggle');

    $('#selectCourseButton').click(function () {
      let coursekey = $('#selectCourse').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
      for (let j in data) {
        if (data[j].coursekey == coursekey.courseSelect) {
          obj.courseData.coursekey = data[j].coursekey;
          obj.courseData.course_id = data[j].id;
          Statistics.getStats(obj.courseData.course_id);
        }
      }
      document.cookie = `coursekey=${coursekey.courseSelect}; path=/kurssit/${htmlID};`;
      $('#currentCourse').html(obj.courseData.coursekey);
    });
  }

  _isTeacherCourse() {
    for (let i in this.courseData.data) {
      let course = this.courseData.data[i];
      if (course.coursekey === this.courseData.coursekey) {
        return true;
      }
    }
    return false;
  }

  /**
   * Extracts current course (Teacher)
   * @param  {Obj} data JSON course data
   */
  _extractTeacherCourses(data) {
    let schedulemanager;

    let htmlID = this._getHTMLID(window.location.pathname);
    let keys = [];
    let obj = this;
    for (let i in data) {
      if (data[i].html_id == htmlID) {
        this.courseData.coursekey = data[i].coursekey;
        this.courseData.course_id = data[i].id;
        keys.push(data[i].coursekey);
      }
    }

    if (keys.length > 1 && document.getCookie('coursekey') === undefined) {
      this._invokeCourseSelect(htmlID, keys, data);
    } else {
      for (let j in data) {
        if (data[j].coursekey == document.getCookie('coursekey')) {
          this.courseData.coursekey = data[j].coursekey;
          this.courseData.course_id = data[j].id;
        }
      }
    }

    if (this.courseData.course_id.length !== 0 && this._isTeacherCourse(data)) {
      Statistics.getStats(this.courseData.course_id);
      schedulemanager = new ScheduleManager();
    }

    if (this.courseData.coursekey.length > 1) {

      $('html body main.has-atop article article section header:first').append(`<div class="chosenCourse"><h3>Valittu kurssi: <tt><span id="currentCourse">${this.courseData.coursekey}<span></tt></h3></div>`);

      view.createOpenScheduleManagerLink();

      let openScheduleModal = document.getElementById('open-schedule-modal');
      openScheduleModal.onclick = function () {
        schedulemanager.getSchedule(obj.getCourseID());
        document.getElementById('schedule-footer-info').innerHTML = '';
      };

      let createScheduleButton = document.getElementById('create-schedule');
      createScheduleButton.onclick = function () {
        schedulemanager.createSchedule(obj.getCourseID());
      };

    }
    // insert button
    if (keys.length > 1) {
      $('html body main.has-atop article article section header:first').append(`<button id="selectAnotherCourse" class="btn btn-info" style="margin-bottom: 10px">Valitse toinen kurssi</button>`);
      $('#selectAnotherCourse').click(function () {
        obj._invokeCourseSelect(htmlID, keys, data);
      });
    }
    this.getAndShowSchedules(this.courseData.course_id);
  }

  getAndShowSchedules(courseId) {
    const scheduleCheckbox = new ScheduleCheckbox(courseId);

    // Add listener
    $('#saveScheduleButton').click(function () {
      scheduleCheckbox.saveScheduleChanges();
    });
  }

  /**
   * Init function (Teacher)
   * @param  {Obj} data Course data
   */
  initTeacher(data) {
    this.courseData.data = data;
    this._extractTeacherCourses(data);
  }

  getCourseID() {
    // Caution. Asynchronous!
    return this.courseData.course_id;
  }

  /**
   * Switches class visibility
   * @param  {String} className Class name
   */
  toggleVisibilityByClass(className) {
    let arrayOfElements = document.getElementsByClassName(className);
    for (let i = 0; i < arrayOfElements.length; i++) {
      let x = arrayOfElements[i];
      if (x.style.display === 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  }

  getTeacher() {
    if (document.getCookie('teacher') === 'true') {
      backend.get(`teachers/${Session.getUserId()}/courses`)
        .then(
          function fulfilled(data) {
            button.initTeacher(data);
          },
          function rejected(data) {
            console.warn(data);
          }
        );
    }
  }

  getStudent() {
    if (document.getCookie('student') === 'true') {
      backend.get(`students/${Session.getUserId()}/courses`)
        .then(
          function fulfilled(data) {
            button.init(data);
          },
          function rejected() {
            console.warn("Error, could not get coursekey");
          });
    }
  }

  initialize() {
    let obj = this;
    if (document.getCookie('student') === 'true' && document.getCookie('teacher') === 'true') {
      $('html body main.has-atop article article section header:first').append(`<button style="margin-bottom: 20px" class="changeRole btn btn-success" onClick="$('#selectRole').modal('toggle');"><span id="roleSpan">Valitse käyttäjä</span></button>`);
      if (document.getCookie('role') === 'teacher') {
        obj.getTeacher();
        $('#roleSpan').text("Opettaja");
      } else if (document.getCookie('role') === 'student') {
        obj.getStudent();
        $('#roleSpan').text("Opiskelija");
      } else {
        $('#selectRole').modal('toggle');
      }
    } else if (document.getCookie('student') === 'false' && document.getCookie('teacher') === 'true') {
      obj.getTeacher();
    } else if (document.getCookie('student') === 'true' && document.getCookie('teacher') === 'false') {
      obj.getStudent();
    }
  }

}

/**
 * Execute when DOM has loaded
 */
$(document).ready(function () {
  button = new Button();
  $('.toggleDivVisibility').click(function () {
    button.toggleVisibilityByClass(this.id);
  });

  if (window.location.pathname.includes("/kurssit") && Session.getUserId() !== undefined) {
    button.initialize();
  }

  $('.roleButton').click(function () {
    if (this.id === 'teacher') {
      button.getTeacher();
      document.cookie = `role=teacher; path=/;`;
    } else {
      button.getStudent();
      document.cookie = `role=student; path=/;`;
    }
    location.reload();
  });
});
