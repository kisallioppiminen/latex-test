/**
 * Flatpickr options
 */
flatpickr(".flatpickr", {
  "locale": "fi",
  defaultDate: "a",
  altInput: true,
  altFormat: "F j, Y"
});

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
          const alert = '<div id="join_course_alert" class="alert alert-danger" role="alert">' + data.error + '</div>';
          $('#validationMessage').html(alert).show();
        }
      );
  }

  static getCourseExercises(data) {
    $.ajax({
      url: FRONTEND_BASE_URL + `kurssit/${data.courseSelect}/print.html`,
      success: function (pageData) {
        let exercises = Exercises.extractExercises(pageData);
        Course.createCoursePost(data, exercises);
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
