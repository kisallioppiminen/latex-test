let myCourses;
let courseName2;
let coursekey2;

class CourseList {

  static createCourseList(data) {
    myCourses = data;
    for (let i in data) {
      this._createListItem(data[i]);
    }
    // place a listener when collapse is opened
    $('header h1 a').click(function () {
      const scoreboard = new Scoreboard();
      scoreboard.init(data, this.id);
    });

    $('.btn-exit').click(function () {
      CourseList._removeFromCourse();
    });
  }

  static _createListItem(data) {
    const sd = new Date(data.startdate);
    const ed = new Date(data.enddate);
    const formattedTime = `${sd.getDate()}.${sd.getMonth() + 1}.${sd.getFullYear().toString().substr(2,2)} – ${ed.getDate()}.${ed.getMonth() + 1}.${ed.getFullYear().toString().substr(2,2)}`;
    let listItem = view.createListItem(data, formattedTime);
    $(".courseList").append(listItem);
  }

  init() {
    let role = 'teachers';
    if (window.location.pathname.includes("/omat_kurssit")) {
      role = 'students';
    }

    backend.get(`${role}/${Session.getUserId()}/courses`)
      .then(
        function fulfilled(data) {
          CourseList.createCourseList(data);
        },
        function rejected() {
        }
      );
  }

  static _removeFromCourse() {
    $("#leaveCourse").on('click', function () {
      let coursekey1 = $("#coursekeyRemove").val();
      for (let i in myCourses) {
        if (coursekey1 === coursekey2) {
          let courseName1 = myCourses[i].name + ' (' + myCourses[i].html_id + ')';

          if (courseName1.toLowerCase() === courseName2.toLowerCase()) {
            let courseId = myCourses[i].id;
            backend.delete(`students/${Session.getUserId()}/courses/${courseId}`);
            document.deleteCookie("student");
            document.deleteCookie("teacher");
            document.deleteCookie("role");
            $('#remove_course_alert').html("Olet poistunut kurssilta " + courseName1).show();
            $('#remove_course_alert').attr("class", "alert alert-success");
            setTimeout(function(){ Session.getSession(); }, 500);
            break;
          } else {
            $('#remove_course_alert').html('Kurssia ei löytynyt').show();
          }

        } else {
          $('#remove_course_alert').html('Kurssia ei löytynyt').show();
        }
      }
    });
  }
}

/**
 * Execute when DOM has loaded, get teacher's scoreboards
 */
$(document).ready(function () {
  const courselist = new CourseList();
  courselist.init();

  $('#leaveCourseModal').on('show.bs.modal', function (e) {
    courseName2 = $(e.relatedTarget).siblings('h1:first').text();
    coursekey2 = $(e.relatedTarget).siblings('h3').text();
    $('#remove_course_alert').text('Olet poistumassa kurssilta ' + courseName2 + '. Poistuminen poistaa lopullisesti kaikki kurssiin liittyvät tietosi.');
  });
});
