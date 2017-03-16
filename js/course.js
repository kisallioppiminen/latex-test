/**
 * Flatpickr options
 */
flatpickr(".flatpickr", {
  "locale": "fi",
  defaultDate: "a",
  altInput: true,
  altFormat: "F j, Y"
});

/**
 * Sends new course information to backend.
 * @param  {Object} exercises Exercises as a JavaScript object
 */
class Course {

  static createCoursePost(data, exercises) {
    let course = {
      html_id: data.courseSelect,
      coursekey: data.coursekey,
      name: data.courseName,
      exercises: exercises,
      startdate: data.startDate,
      enddate: data.endDate
    };

    backend.post('courses/newcourse', course)
      .then(
        function fulfilled(data) {
          const alert = '<div id="join_course_alert" class="alert alert-success" role="alert">' + data.message + '</div>';
          $('#validationMessage').html(alert).show();
        },
        function rejected(data) {
          const alert = '<div id="join_course_alert" class="alert alert-danger" role="alert">' + JSON.parse(data.responseText).error + '</div>';
          $('#validationMessage').html(alert).show();
        }
      );
  }

  static extractExercises(data, pageData) {
    const regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    let regex_array = regex.exec(pageData);

    let exercises = {};
    let chapterNumber = 0;
    let exerciseCounter = 1;

    while (regex_array != null) {
      if (regex_array[1] == null) {
        exercises[chapterNumber + "." + exerciseCounter] = regex_array[2];
        exerciseCounter++;
      } else if (regex_array[2] == null) {
        chapterNumber = regex_array[1];
        exerciseCounter = 1;
      }
      regex_array = regex.exec(pageData);
    }
    Course.createCoursePost(data, exercises);
  }

  static getCourseExercises(data) {
    $.ajax({
      url: FRONTEND_BASE_URL + `kurssit/${data.courseSelect}/print.html`,
      success: function (pageData) {
        Course.extractExercises(data, pageData);
      },
      error: function () {
        console.log("Could not retrieve course page");
      }
    });
  }

  static init(data) {
    this.getCourseExercises(data);
  }

}

/**
 * Executes as soon as DOM has loaded
 */
$(document).ready(function () {
  $("#submitCourse").on('click', function () {
    let alert = '<div id="join_course_alert" class="alert alert-info" role="alert">Kurssia luodaan...</div>';
    $('#validationMessage').html(alert).show();
    let data = $(this).parent().parent().serializeArray().reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    Course.init(data);
  });

  // Form validation
  $('input').on('input', function () {
    let b = true;
    if ($("#courseName").val().length == 0) { b = false; }
    if ($("#coursekey").val().length == 0) { b = false; }
    if ($("#startDate").val().length == 0) { b = false; }
    if ($("#endDate").val().length == 0) { b = false; }
    if (b) {
      $("#submitCourse").prop("disabled", false);
      $("#validationMessage").hide();
    } else {
      $("#submitCourse").prop("disabled", true);
      $("#validationMessage").show();
    }
  });

});
