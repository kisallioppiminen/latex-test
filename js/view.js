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
    let nav = document.querySelector('nav>ul');

    // Create navigation link
    let liDropdown = document.createElement('li');
    liDropdown.setAttribute('role', 'presentation');
    liDropdown.setAttribute('class', 'dropdown');
    liDropdown.style.textTransform = 'none';

    let aDropdown = document.createElement('a');
    aDropdown.setAttribute('role', 'button');
    aDropdown.setAttribute('href', '#');
    aDropdown.setAttribute('data-toggle', 'dropdown');
    aDropdown.setAttribute('class', 'dropdown-toggle');

    let span = document.createElement('span');
    span.innerHTML = 'Hei, '+ session.getUserFirstName();

    let spanCaret = document.createElement('span');
    spanCaret.setAttribute('class', 'caret');

    aDropdown.appendChild(span);
    aDropdown.appendChild(spanCaret);
    liDropdown.appendChild(aDropdown);

    // Create dropdown links
    let dropdownMenu = document.createElement('ul');
    dropdownMenu.setAttribute('class', 'dropdown-menu');

    // Create links for dropdow menu
    let kurssihallinta = [{key: 'href', value: FRONTEND_BASE_URL + 'kurssihallinta.html'}];
    let omatKurssit = [{key: 'href', value: FRONTEND_BASE_URL + 'omat_kurssit.html'}];

    let kirjauduUlos = [
    {key: 'href', value: BACKEND_BASE_URL + 'users/sign_out.html'},
    {key: 'rel', value: 'nofollow'},
    {key: 'data-method', value: 'GET'}
    ];
    let kirjauduUlosClickEvent = function () {
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
    let nav = document.querySelector('nav>ul');
    let kirjautuminen = [
    {key: 'href', value: '#'}, 
    {key: 'id', value: 'kirjautuminen'}, 
    {key: 'data-toggle', value: 'modal'},
    {key: 'data-target', value: '#login-modal'}
    ];
    this.nav.appendChild(this._createLink(kirjautuminen, 'Kirjautuminen'));
  }

  _createLink(att, text, clickEvent) {
    let li = document.createElement('li');
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

}



