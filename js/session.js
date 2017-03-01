/**
 * @file Session ja näkyminen hallinta kirjautumisen mukaan.
 * @license GPL v2
 * @version 1.00
 */

 /**
  * @class
  */
function Session() {
}


// Init function
// -------------

/**
 * Jos evästeiden mukaan ei ole kirjautunut, käy katsomassa palvelimelta
 * onko kirjautunut. Asettaa evästeen, jos palvelin todentaa kirjautumisen.
 * Ei kysele palvelimelta kirjautumista, jos eväste on asetettu.
 */
Session.prototype.init = function () {
  if (!this.isLogged()) {
    this.getSession();
  } 
}

/**
 * Palauttaa evästeistä käyttäjän ID:n.
 *
 * @returns {Number} Käyttäjän ID.
 */
Session.prototype.getUserId = function() {
  return document.getCookie('userId');
}

/**
 * Palauttaa evästeistä käyttäjän etunimen.
 *
 * @returns {String} Käyttäjän etunimi.
 */
Session.prototype.getUserFirstName = function() {
  return document.getCookie('userFirstName');
}

/**
 * Poistaa evästeet, joilla kirjautumista tarkkaillaan.
 *
 */
Session.prototype.logout = function() {
  document.deleteCookie('userId');
  document.deleteCookie('userFirstName');
}

/**
 * Näyttää navigaatiopalkissa linkit sen mukaan, onko kirjautunut vai ei
 * muuttamalla CSS:n display arvoa. Kirjautuminen todetaan evästeiden
 * avulla.
 *
 * @TODO Voi olla, että näyttäminen kannattaa ehkä tehdä DOM rakenteen
 * manipuloinnilla, koska silloin voin olla helpompaa käyttää
 * globaalimuuttujaa BACKEND_BASE_URL. Sen arvoa on helppo muuttaa
 * käynnistämällä Jekyll sopivalla ympäristömuuttujalla.
 */
Session.prototype.showNav = function() {
  var LOGGEDIN = document.getElementsByClassName('logged-in');
  var LOGGEDOUT = document.getElementsByClassName('logged-out');
  if (this.isLogged()) {

  // $('body > nav ul').css('margin-top', '0');

  /* Create navigation link */
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

  /* Create dropdown links */
  var dropdownMenu = document.createElement('ul');
  dropdownMenu.setAttribute('class', 'dropdown-menu');

  var liKurssihallinta = document.createElement('li');
  var aKurssihallinta = document.createElement('a');
  aKurssihallinta.setAttribute('href', FRONTEND_BASE_URL + '/kurssihallinta.html');
  aKurssihallinta.innerHTML = 'Kurssihallinta';
  liKurssihallinta.appendChild(aKurssihallinta);

  var liOmatKurssit = document.createElement('li');
  var aOmatKurssit = document.createElement('a');
  aOmatKurssit.setAttribute('href', FRONTEND_BASE_URL + '/omat_kurssit.html');
  aOmatKurssit.innerHTML = 'Omat kurssit';
  liOmatKurssit.appendChild(aOmatKurssit);

  var liKirjauduUlos = document.createElement('li');
  var aKirjauduUlos = document.createElement('a');
  aKirjauduUlos.setAttribute('href', BACKEND_BASE_URL + '/users/sign_out');
  aKirjauduUlos.setAttribute('rel', 'nofollow');
  aKirjauduUlos.setAttribute('data-method', 'GET');
  aKirjauduUlos.setAttribute('id', 'logout');
  aKirjauduUlos.innerHTML = 'Kirjaudu ulos';
  liKirjauduUlos.appendChild(aKirjauduUlos);

  dropdownMenu.appendChild(liKurssihallinta);
  dropdownMenu.appendChild(liOmatKurssit);
  dropdownMenu.appendChild(liKirjauduUlos);
  li.appendChild(dropdownMenu);

  /* Add everything to navigation bar */
  var nav = $('nav>ul')[0];
  nav.appendChild(li);

  } else {
    for(var i=0; i < LOGGEDOUT.length; i++) {
      LOGGEDOUT[i].style.display = 'initial';
    }
  }
}

/**
 * Jos evästeitä ei ole asetettu, käy kysymässä palvelimelta onko kyseinen
 * käyttäjä kirjautunut. Jos on, asettaa evästeet, eikä kyselyä enää tehdä,
 * vaan luotetaan siihen, että evästeiden olemassaolo riittää todisteeksi, että
 * on kirjautunut.
 *
 * @todo Käytännössä funktion käynnistäminen kannattaa tehdä silloin, kun
 * evästeitä ei ole ja tehdään kirjautuminen, koska muuten tehdään aina kysely,
 * kun ei olla kirjauduttu.
 *
 * @todo Session metodia showNav() kutsutaan tässä, ja kutsutaan myös sen
 * sen jälkeen kun koko html on ladattu. Käytännössä funktiota kutsutaan
 * kahdesti. Tässä funktiossa oleva kutsu osaa kuitenkin tehdä kutsun vasta sen
 * jälkeen kun evästeet on varmasti asetettu. Myöhemmin tuleva kutsu tekee sen
 * ennen kuin palvelimelta on tullut kirjautumisvarmistus.
 */
Session.prototype.getSession = function() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState !== this.DONE) {
      return false;
    }
    if (req.status !== 200) {
      return false;
    }

    var session_user = JSON.parse(req.responseText);

    if (session_user.has_sign_in !== null && session_user.has_sign_in !== undefined) {
      document.cookie = 'userId=' + session_user.has_sign_in.id;
      document.cookie = 'userFirstName=' + session_user.has_sign_in.first_name;
      session.showNav();
    }
  }

  req.open('GET', BACKEND_BASE_URL + 'user/get_session_user', true);
  req.withCredentials = true;
  req.send();
}

/** 
 * Palauttaa True jos käyttäjä on kirjautunut ja False, jos käyttäjä ei ole
 * kirjautunut. Todennus tapahtuu evästeiden avulla.
 */
Session.prototype.isLogged = function() {
  if (document.getCookie('userId') !== undefined && document.getCookie('userFirstName') !== undefined) {
    return true;
  } else {
    return false;
  }
}


// Start session
// -------------

var session;

session = new Session();
session.init();

/** 
 * Käynnistetään sessio. Sessio olio on globaali.
 */
window.onload = function() {

  session.showNav();

  // Let logout also handle cookies
  var a = document.getElementById('logout');

  a.onclick = function() {
    session.logout();
  }

}
