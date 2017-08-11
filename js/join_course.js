/**
 * Sends new course signup information to backend.
 * @param  {String} coursekey Course key
 */
class JoinCourse {

  static sendSignUpJSON(coursekey) {
    backend.post('courses/join', coursekey)
      .then(
        function fulfilled(data) {
          let alert = '<div id="join_course_alert" class="alert alert-success" role="alert">' + data.message + '</div>';
          $('#join_course_group').prepend(alert);
          document.cookie = "student=true;path=/";
          location.reload();
        },
        function rejected(data) {
          let alert = '<div id="join_course_alert" class="alert alert-danger" role="alert">' + data.error + '</div>';
          $('#join_course_group').prepend(alert);
        }
      );
  }
}

/**
 * Execute when DOM has loaded
 */
$(document).ready(function () {

  $("#joiningForm").on('submit', function (e) {
    $('#join_course_alert').remove();
    let data = $(this).serializeArray().reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    JoinCourse.sendSignUpJSON(data);
    e.preventDefault();
  });

});
