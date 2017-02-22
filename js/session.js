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


// Useful API
// ----------

/**
 * Palauttaa evästeistä käyttäjän ID:n.
 *
 * @returns {Number} Käyttäjän ID.
 */
Session.prototype.getUserId = function() {
  return this.getCookie('userId');
}

/**
 * Palauttaa evästeistä käyttäjän etunimen.
 *
 * @returns {String} Käyttäjän etunimi.
 */
Session.prototype.getUserFirstName = function() {
  return this.getCookie('userFirstName');
}

/**
 * Poistaa evästeet, joilla kirjautumista tarkkaillaan.
 *
 */
Session.prototype.logout = function() {
  this.deleteCookie('userId');
  this.deleteCookie('userFirstName');
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
    for(var i=0; i < LOGGEDIN.length; i++) {
      LOGGEDIN[i].style.display = 'initial';
    }
  } else {
    for(var i=0; i < LOGGEDOUT.length; i++) {
      LOGGEDOUT[i].style.display = 'initial';
    }
  }
}


// Helper functions
// ----------------

/**
 * Hakee evästeen avaimen mukaan.
 *
 * @param {String} key
 */
Session.prototype.getCookie = function(key) {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + key + '=');
  if (parts.length == 2) return parts.pop().split(';').shift();
}

/**
 * Tuhoaa evästeen avaimen mukaan.
 *
 * @param {String} key
 */
Session.prototype.deleteCookie = function(key) {
  document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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

  req.open("GET", BACKEND_BASE_URL + "user/get_session_user", true);
  req.withCredentials = true;
  req.send();
}

/** 
 * Palauttaa True jos käyttäjä on kirjautunut ja False, jos käyttäjä ei ole
 * kirjautunut. Todennus tapahtuu evästeiden avulla.
 */
Session.prototype.isLogged = function() {
  if (this.getCookie('userId') !== undefined && this.getCookie('userFirstName') !== undefined) {
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

  var a = document.getElementById("logout");

  a.onclick = function() {
    session.logout();
  }

  session.showNav();
}
