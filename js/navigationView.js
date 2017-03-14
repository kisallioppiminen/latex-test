 /**
  * @class
  */

class NavigationView {

  constructor() {
    this.nav = document.querySelector('nav>ul');
  }
  
  showNavigation() {
    if (session.isLogged()) {
      this.buildUser();
      // view.navigation.buildUser();
    } else {
      this._buildGuest();
    }
  }
  
  buildUser() {
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
    var kurssihallinta = [{key: 'href', value: FRONTEND_BASE_URL + 'kurssihallinta.html'}];
    var omatKurssit = [{key: 'href', value: FRONTEND_BASE_URL + 'omat_kurssit.html'}];

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

  _buildGuest(){
    var nav = document.querySelector('nav>ul');
    var kirjautuminen = [
    {key: 'href', value: '#'}, 
    {key: 'id', value: 'kirjautuminen'}, 
    {key: 'data-toggle', value: 'modal'},
    {key: 'data-target', value: '#login-modal'},
    ];
    this.nav.appendChild(this._createLink(kirjautuminen, 'Kirjautuminen'));
  }

  _createLink(att, text, clickEvent) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    att.forEach(function(conf) {
      a.setAttribute(conf.key, conf.value);
    });
    a.innerHTML = text;

    if (clickEvent instanceof Function) {
      a.onclick = clickEvent;
    } 

    li.appendChild(a);
    return li;
  }
}



