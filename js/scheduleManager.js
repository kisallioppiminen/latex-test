class ScheduleManager {

  createSchedule(courseId) {
    let obj = this;

    let colors = new Map();
    colors.set('option-brown', 1);
    colors.set('option-blue', 2);
    colors.set('option-green', 3);
    colors.set('option-orange', 4);
    colors.set('option-yellow', 5);

    let formData = $('#create-schedule-form').serializeArray();
    let jsonData = {
      'name': formData[0].value,
      'color': colors.get(formData[1].value)
    };

    let info = document.getElementById('schedule-footer-info');
    info.innerHTML = 'Uutta tavoitetta luodaan...';

    backend.post(`courses/${courseId}/schedules/new`, jsonData)
      .then(
          function fulfilled() {
            info.innerHTML = 'Tavoite luotu!';
            document.getElementById('schedule-name').value = '';
            obj.getSchedule(button.getCourseID());
          },
          function rejected(response) {
            info.innerHTML = response.error;
          });
  }

  getSchedule(courseId) {
    let obj = this;

    backend.get(`courses/${courseId}/schedules`)
      .then(
          function fulfilled(data) {

            view.clearScheduleManagerColor();

            let colors = ['brown', 'blue', 'green', 'orange', 'yellow'];
            let isReserved;

            for (let i = 0; i < colors.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (data[j].color - 1 == i) {
                  view.createScheduleColorSection(colors[i], data[j], obj);
                  isReserved = true;
                }
              }
              if (!isReserved) {
                view.createScheduleColorSection(colors[i]);
              }
              isReserved = false;
            }

          },
          function rejected() {
          });
  }

  deleteSchedule(courseId, scheduleId) {
    let obj = this;
    let info = document.getElementById('schedule-footer-info');
    info.innerHTML = 'Tavoitetta tuhotaan...';
    backend.delete(`courses/${courseId}/schedules/${scheduleId}`)
      .then(
          function fulfilled(data) {
            info.innerHTML = 'Tavoite on poistettu!';
            obj.getSchedule(button.getCourseID());
          },
          function rejected(err) {
            info.innerHTML = 'Tavoitteen poistaminen epäonnistui.';
          });
  }

}
