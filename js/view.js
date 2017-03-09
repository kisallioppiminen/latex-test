var view = {}

view.navigation = (function() {

  var nav = $('nav>ul')[0];

  function addUser() {

  // Create navigation link
  var li = document.createElement('li');
  li.setAttribute('role', 'presentation');
  li.setAttribute('class', 'dropdown');
  li.style.textTransform = 'none';

  var aNav = document.createElement('a');
  aNav.setAttribute('role', 'button');
  aNav.setAttribute('href', '#');
  aNav.setAttribute('data-toggle', 'dropdown');
  aNav.setAttribute('class', 'dropdown-toggle');

  var span = document.createElement('span');
  span.innerHTML = 'Hei, '+ session.getUserFirstName();

  var spanCaret = document.createElement('span');
  spanCaret.setAttribute('class', 'caret');
  
  aNav.appendChild(span);
  aNav.appendChild(spanCaret);
  li.appendChild(aNav);

  // Create dropdown links
  var dropdownMenu = document.createElement('ul');
  dropdownMenu.setAttribute('class', 'dropdown-menu');

  // Create kurssihallinta
  var liKurssihallinta = document.createElement('li');
  var aKurssihallinta = document.createElement('a');
  aKurssihallinta.setAttribute('href', FRONTEND_BASE_URL + 'kurssihallinta.html');
  aKurssihallinta.innerHTML = 'Kurssihallinta';
  liKurssihallinta.appendChild(aKurssihallinta);

  // Create Omat Kurssit
  var liOmatKurssit = document.createElement('li');
  var aOmatKurssit = document.createElement('a');
  aOmatKurssit.setAttribute('href', FRONTEND_BASE_URL + 'omat_kurssit.html');
  aOmatKurssit.innerHTML = 'Omat kurssit';
  liOmatKurssit.appendChild(aOmatKurssit);

  // Create Kirjaudu Ulos
  var liKirjauduUlos = document.createElement('li');
  var aKirjauduUlos = document.createElement('a');

  aKirjauduUlos.onclick = function() {
    // can't do with this.session because out of scope
    session.logout();
  }

  aKirjauduUlos.setAttribute('href', BACKEND_BASE_URL + 'users/sign_out');
  aKirjauduUlos.setAttribute('rel', 'nofollow');
  aKirjauduUlos.setAttribute('data-method', 'GET');
  aKirjauduUlos.innerHTML = 'Kirjaudu ulos';
  liKirjauduUlos.appendChild(aKirjauduUlos);

  // Append everything to dropdown menu
  dropdownMenu.appendChild(liKurssihallinta);
  dropdownMenu.appendChild(liOmatKurssit);
  dropdownMenu.appendChild(liKirjauduUlos);
  li.appendChild(dropdownMenu);

  // Append everything to navigation bar
  nav.appendChild(li);

  }

  function addGuest() {
    var liKirjautuminen = document.createElement('li');
    var aKirjautuminen = document.createElement('a');
    aKirjautuminen.setAttribute('href', '#');
    aKirjautuminen.setAttribute('id', 'kirjautuminen');
    aKirjautuminen.setAttribute('data-toggle', 'modal');
    aKirjautuminen.setAttribute('data-target', '#login-modal');
    aKirjautuminen.innerHTML = 'Kirjautuminen';
    liKirjautuminen.appendChild(aKirjautuminen);
    nav.appendChild(liKirjautuminen);
  }

  return {
    addUser : addUser,
    addGuest : addGuest
  };

})();
