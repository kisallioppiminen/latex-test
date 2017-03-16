class CourseList {

  static createCourseList(data) {
    for (let i in data) {
      this._createListItem(data[i]);
    }
    // place a listener when collapse is opened
    $('header h1 a').click(function () {
      const scoreboard = new Scoreboard();
      scoreboard.init(data, this.id);
    });
  }

  static _createListItem(data) {
    const sd = new Date(data.startdate);
    const ed = new Date(data.enddate);
    const formattedTime = `${sd.getDate()}.${sd.getMonth() + 1}.${sd.getFullYear().toString().substr(2,2)} – ${ed.getDate()}.${ed.getMonth() + 1}.${ed.getFullYear().toString().substr(2,2)}`;
    let html_boilerplate = `<section class="panel panel-courselisting"> 
          <header>
          <h1>${data.name}
          </h1>
          <h2 style="display: inline-block; color: #888888">${formattedTime}</h2>
          <h1 style="float: right;">
              <a id="${data.coursekey}" data-toggle="collapse" class="collapsed" data-target="#checkmarkTable${data.coursekey}"></a>
          </h1>
          <h3 style="font-family: monospace; float: right; display: inline-block; color: #666666">${data.coursekey}</h3>
          </header>

          <div id="checkmarkTable${data.coursekey}" class="collapse" style="overflow-x:auto;">
              <div class="alert alert-info" id="loadingAlert${data.coursekey}">
                  <strong>Ladataan tulostaulua...</strong>
              </div>
          </div></section>`;

    $(".courseList").append(html_boilerplate);
  }

  init() {
    let role = 'teachers';
    if (window.location.pathname.includes("/omat_kurssit")) {
      role = 'students';
    }

    backend.get(`${role}/${session.getUserId()}/courses`)
      .then(
        function fulfilled(data) {
          CourseList.createCourseList(data);
        },
        function rejected() {
          console.warn("Could not retrieve course keys");
        }
      );
  }

}

/**
 * Execute when DOM has loaded, get teacher's scoreboards
 */
$(document).ready(function () {
  const courselist = new CourseList();
  courselist.init();

});
