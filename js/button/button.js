class Button {

  constructor() {
    this.courseData = {
      coursekey: '',
      course_id: ''
    };
  }

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

      $(value).find("div:first").append(buttonDiv);
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
    const restfulUrl = `students/${session.getUserId()}/courses/${this.courseData.course_id}/checkmarks`;

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
          if(checkmark.status !== 'gray') {
            obj._changeButtonTitleText(id.substr(2, id.length - 1), "Vastauksesi on lähetetty!");
            obj._changeProblemHeaderColor(id);
          }
        },
        function rejected(data) {
          obj._changeButtonTitleText(id.substr(2, id.length - 1), "Virhe! " + data.error);
        }
      );
  }

  init(data) {
    this._extractCourseData(data, this._getHTMLID(window.location.pathname));
    if (this.courseData.coursekey !== '') {
      this._addButtons();
      this._getCheckmarks();
    } else {
      console.warn("No coursekey for this material.");
    }
  }

}

/**
 * Execute when DOM has loaded
 */
$(document).ready(function () {
  if (window.location.pathname.includes("/kurssit") && session.getUserId() !== undefined) {
    const button = new Button();
    backend.get(`students/${session.getUserId()}/courses`)
      .then(
        function fulfilled(data) {
          button.init(data);
        },
        function rejected() {
          console.warn("Error, could not get coursekey");
        });
  }
});
