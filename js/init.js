const view = new View();
const backend = new Backend();

Session.init();

$(document).ready(function() {
  view.showNavigation();
});
