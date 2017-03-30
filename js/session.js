/**
 * @file Session ja näkyminen hallinta kirjautumisen mukaan.
 * @license GPL v2
 * @version 1.00
 */

 /**
  * @class
  */
class Session {

  /**
   * Jos evästeiden mukaan ei ole kirjautunut, käy katsomassa palvelimelta
   * onko kirjautunut. Asettaa evästeen, jos palvelin todentaa kirjautumisen.
   * Ei kysele palvelimelta kirjautumista, jos eväste on asetettu.
   */
  static init() {
    if (this.isLogged()) {
      this.getSession();
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
  static getSession() {

    backend.get('user/get_session_user')
      .then(
        function fulfilled(data) {
          const session_user = data;

          if (session_user.has_sign_in !== null && session_user.has_sign_in !== undefined) {
            document.cookie = 'userId=' + session_user.has_sign_in.id;
            document.cookie = 'userFirstName=' + session_user.has_sign_in.first_name;
          }
        },
        function rejected() {
          console.warn('Could not retrieve session');
        }
      );

  }

  /**
   * Palauttaa evästeistä käyttäjän etunimen.
   *
   * @returns {String} Käyttäjän etunimi.
   */
  static getUserFirstName() {
    return document.getCookie('userFirstName');
  } 

  /**
   * Palauttaa evästeistä käyttäjän ID:n.
   *
   * @returns {Number} Käyttäjän ID.
   */
  static getUserId() {
    return document.getCookie('userId');
  }

  /** 
   * Palauttaa True jos käyttäjä on kirjautunut ja False, jos käyttäjä ei ole
   * kirjautunut. Todennus tapahtuu evästeiden avulla.
   */
  static isLogged() {
    return document.getCookie('userId') !== undefined && document.getCookie('userFirstName') !== undefined;
  }

  /**
   * Poistaa evästeet, joilla kirjautumista tarkkaillaan.
   *
   */
  static logout() {
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
  }
}
