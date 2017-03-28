 /**
  * @class
  */

class View {

  constructor() {
    this.nav = document.querySelector('nav>ul');
  }
  
  showNavigation() {
    if (session.isLogged()) {
      this._buildUser();
    } else {
      this._buildGuest();
      this._buildModal();
    }
  }

  _buildModal() {
    const AUTHURL = 'users/auth/google_oauth2';
    let attributes;

    let divBody = document.getElementById('login-modal-body');
    let a = document.createElement('a');
    let img = document.createElement('img');

    img.setAttribute('src', '/img/google-login.png');
    img.setAttribute('alt', 'Google-nappula');

    a.setAttribute('href', BACKEND_BASE_URL + AUTHURL);

    a.append(img);
    divBody.append(a);

    if (FRONTEND_BASE_URL == "http://localhost:4000/") {

      let input;
      let formDiv = document.createElement('div');

      attributes = [
        {key: 'id', value: 'new_user'},
        {key: 'action', value: BACKEND_BASE_URL + 'users/sign_in'},
        {key: 'accept-charset', value: 'UTF8'},
        {key: 'method', value: 'post'}];

      let form = this._addAttributesToElement(attributes, document.createElement('form'));

      attributes = [
        {key: 'id', value: 'user_email'}, 
        {key: 'class', value: 'form-control'},
        {key: 'type', value: 'email'},
        {key: 'name', value: 'user[email]'},
        {key: 'placeholder', value: 'Käyttäjätunnus'}];

      input = this._addAttributesToElement(attributes, document.createElement('input'));
      formDiv.append(input);

      attributes = [
        {key: 'id', value: 'user_password'}, 
        {key: 'class', value: 'form-control'},
        {key: 'type', value: 'password'},
        {key: 'name', value: 'user[password]'},
        {key: 'placeholder', value: 'Salasana'}]; 

      input = this._addAttributesToElement(attributes, document.createElement('input'));
      formDiv.append(input);

      attributes = [
        {key: 'class', value: 'login loginmodal-submit btn btn-default'},
        {key: 'type', value: 'submit'},
        {key: 'name', value: 'commit'},
        {key: 'value', value: 'Kirjaudu'}];

      input = this._addAttributesToElement(attributes, document.createElement('input'));
      formDiv.append(input);

      form.append(formDiv);
      divBody.append(form);
    }
  }
  
  _buildUser() {
    var nav = document.querySelector('nav>ul');

    // Create navigation link
    var liDropdown = document.createElement('li');
    liDropdown.setAttribute('role', 'presentation');
    liDropdown.setAttribute('class', 'dropdown');
    liDropdown.style.textTransform = 'none';

    var aDropdown = document.createElement('a');
    aDropdown.setAttribute('role', 'button');
    aDropdown.setAttribute('href', '#');
    aDropdown.setAttribute('data-toggle', 'dropdown');
    aDropdown.setAttribute('class', 'dropdown-toggle');

    var span = document.createElement('span');
    span.innerHTML = 'Hei, '+ session.getUserFirstName();

    var spanCaret = document.createElement('span');
    spanCaret.setAttribute('class', 'caret');

    aDropdown.appendChild(span);
    aDropdown.appendChild(spanCaret);
    liDropdown.appendChild(aDropdown);

    // Create dropdown links
    var dropdownMenu = document.createElement('ul');
    dropdownMenu.setAttribute('class', 'dropdown-menu');

    // Create links for dropdow menu
    var kurssihallinta = [{key: 'href', value: FRONTEND_BASE_URL + 'omat/kurssihallinta.html'}];
    var omatKurssit = [{key: 'href', value: FRONTEND_BASE_URL + 'omat/omat_kurssit.html'}];

    var kirjauduUlos = [
    {key: 'href', value: BACKEND_BASE_URL + 'users/sign_out.html'},
    {key: 'rel', value: 'nofollow'},
    {key: 'data-method', value: 'GET'}
    ];
    var kirjauduUlosClickEvent = function () {
      session.logout();
    }

    // Append everything to dropdown menu
    dropdownMenu.appendChild(this._createLink(kurssihallinta, 'Kurssihallinta'));
    dropdownMenu.appendChild(this._createLink(omatKurssit, 'Omat kurssit'));
    dropdownMenu.appendChild(this._createLink(kirjauduUlos, 'Kirjaudu ulos', kirjauduUlosClickEvent));
    liDropdown.appendChild(dropdownMenu);

    // Append everything to navigation bar
    nav.appendChild(liDropdown);
  }

  _buildGuest() {
    var nav = document.querySelector('nav>ul');
    var kirjautuminen = [
    {key: 'href', value: '#'}, 
    {key: 'id', value: 'kirjautuminen'}, 
    {key: 'data-toggle', value: 'modal'},
    {key: 'data-target', value: '#login-modal'}
    ];
    this.nav.appendChild(this._createLink(kirjautuminen, 'Kirjautuminen'));
  }

  _createLink(att, text, clickEvent) {
    var li = document.createElement('li');
    let a = this._addAttributesToElement(att, document.createElement('a'));
    a.innerHTML = text;

    if (clickEvent instanceof Function) {
      a.onclick = clickEvent;
    } 

    li.appendChild(a);
    return li;
  }

  _addAttributesToElement(att, element) {
    att.forEach(function(conf) {
      element.setAttribute(conf.key, conf.value);
    });
    return element;
  }

  createButtonDiv(id) {
    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'problemButtonWrap');

    let buttonHeader = document.createElement('h3');
    buttonHeader.setAttribute('id', `textbar_${id}`);
    buttonHeader.innerHTML = 'Miten tehtävä meni?';

    buttonDiv.appendChild(buttonHeader);

    return buttonDiv;
  }

  createButtonGroup() {
    let buttonGroup = document.createElement('div');
    buttonGroup.setAttribute('class', 'btn-group');

    return buttonGroup;
  }

  createButton(status, id) {
    const messages = [
      {
        tooltipText: 'En osannut tehtävää. Tarvitsen apua.',
        status: '0',
        filename: 'sad',
        buttonClass: 'danger'
      },
      {
        tooltipText: 'Ratkaisin tehtävän, mutta olen epävarma vastauksesta.',
        status: '1',
        filename: 'meh',
        buttonClass: 'warning'
      },
      {
        tooltipText: 'Ratkaisin tehtävän ja osaan tämän.',
        status: '2',
        filename: 'happy',
        buttonClass: 'success'
      }
    ];

    let button = document.createElement('button');
    let face = document.createElement('img');
    face.setAttribute('src', `/img/faces/${messages[status].filename}.svg`);
    
    let attributes = [
    {key: 'data-toggle', value: 'tooltip'}, 
    {key: 'id', value: `${status};${id}`}, 
    {key: 'title', value: messages[status].tooltipText},
    {key: 'class', value: `problemButton btn btn-${messages[status].buttonClass} btn-primary`}
    ];

    button = this._addAttributesToElement(attributes, button);
    button.appendChild(face);

    return button;
  }

  createScoreboardFrame(id) {
    let scoreboard = document.createElement('table');
    scoreboard.setAttribute('class', 'sortable');
    scoreboard.setAttribute('id', id);

    let head = document.createElement('thead');
    scoreboard.appendChild(head);

    let column = document.createElement('th');
    column.setAttribute('class', 'nameColumn');

    scoreboard.querySelector('thead').appendChild(column);

    return scoreboard;
  }

  createExercise(number) {
    let item = document.createElement('th');
    item.setAttribute('class', 'numberHeader sortable');
    item.innerHTML = number;
    return item;
  }

  createName(name) {
    let row = document.createElement('tr');
    let item = document.createElement('td');
    item.setAttribute('class', 'name');
    item.innerHTML = name;
    row.appendChild(item);
    return row;
  }

  createCheckmark(key, status, name, exercise) {
    let mark = document.createElement('td');
    mark.setAttribute('id', 'status');
    mark.setAttribute('sorttable_customkey', key);
    let color = document.createElement('div');
    color.setAttribute('class', status);
    color.setAttribute('data-toggle', 'tooltip');
    color.setAttribute('title', `${name} - ${exercise}`);
    mark.appendChild(color);
    return mark;
  }

  createListItem(data, formattedTime) {
    let listItem = document.createElement('section');
    listItem.setAttribute('class', 'panel panel-courselisting');

    let header = document.createElement('header');
    let nameH1 = document.createElement('h1');
    nameH1.innerHTML = data.name;

    let h2 = document.createElement('h2');
    h2.style = "display: inline-block; color: #888888";
    h2.innerHTML = formattedTime;

    let coursekeyH1 = document.createElement('h1');
    coursekeyH1.style = "float: right";

    let collapseAttributes = [
      { key: 'id', value: data.coursekey },
      { key: 'data-toggle', value: 'collapse' },
      { key: 'class', value: 'collapsed' },
      { key: 'data-target', value: `#checkmarkTable${data.coursekey}` }
    ];

    let collapseLink = document.createElement('a');
    collapseLink = this._addAttributesToElement(collapseAttributes, collapseLink);

    coursekeyH1.appendChild(collapseLink);

    let coursekeyH3 = document.createElement('h3');
    coursekeyH3.style = "font-family: monospace; float: right; display: inline-block; color: #666666";

    header.appendChild(nameH1);
    header.appendChild(h2);
    header.appendChild(coursekeyH1);
    header.append(coursekeyH3);
    listItem.appendChild(header);

    let courseDiv = document.createElement('div');
    courseDiv.setAttribute('id', `checkmarkTable${data.coursekey}`);
    courseDiv.setAttribute('class', 'collapse');
    courseDiv.style = "overflow-x:auto;";

    let alertDiv = document.createElement('div');
    alertDiv.setAttribute('class', "alert alert-info");
    alertDiv.setAttribute('id', `loadingAlert${data.coursekey}`);

    let message = document.createElement('strong');
    message.innerHTML = "Ladataan tulostaulua...";

    alertDiv.appendChild(message);
    courseDiv.appendChild(alertDiv);
    listItem.appendChild(courseDiv);

    return listItem;
  }

}



