/**
 * @file Unit tests for view module in file view.js.
 * @license GPL v2
 * @version 1.00
 */

let view;

describe('Navigation view', function() {
  beforeEach(function() {
    let nav = document.createElement('nav');
    let ul = document.createElement('ul');
    nav.appendChild(ul);
    document.body.appendChild(nav);
    view = new View();
  });
  afterEach(function() {
    let navs = document.getElementsByTagName('nav');
    document.body.removeChild(navs[0]);
    view = undefined;
  });

  it('should be empty if nothing has been built', function() {
    let nav = document.getElementsByTagName('nav');
    expect(nav.length).toBe(1);
  })
  it("should have 'Kirjautuminen' in the nav after Guest view has been built", function() {
    view._buildGuest();
    let links = document.getElementsByTagName('a');
    expect(links.length).toBe(1);
    expect(links[0].innerHTML).toBe('Kirjautuminen');
  });

  describe('when user has logged in', function() {
    beforeEach(function() {
      // session = new Session();
      document.cookie = 'userFirstName=Testaaja';
      view._buildUser();
      links = document.getElementsByTagName('a');
    });
    afterEach(function() {
      // session = undefined;
      links = undefined;
      document.cookie = "";
    });

    it('should display four links', function() {
      expect(links.length).toBe(4);
    });
    it('should display a dropdown link with text greeting a user with his or her first name"', function() {
      expect(links[0].firstChild.innerHTML).toBe('Hei, Testaaja');
    });
    it('should display a link named "Kurssihallinta"', function() {
      expect(links[1].innerHTML).toBe('Kurssihallinta');
    });
    it('should have "Kurssihallinta" pointing to the correct URL', function() {
      expect(links[1].href).toBe(FRONTEND_BASE_URL + 'omat/kurssihallinta.html');
    })
    it('should display a link named "Omat kurssit"', function() {
      expect(links[2].innerHTML).toBe('Omat kurssit');
    });
    it('should have "Omat kurssit" pointing to the correct URL', function() {
      expect(links[2].href).toBe(FRONTEND_BASE_URL + 'omat/omat_kurssit.html');
    })
    it('should display a link named "Kirjaudu ulos"', function() {
      expect(links[3].innerHTML).toBe('Kirjaudu ulos');
    });
    it('should have "Kirjaudu ulos" pointing to the correct URL', function() {
      expect(links[3].href).toBe(BACKEND_BASE_URL + 'users/sign_out.html');
    })
  });
});

describe('Login modal', function() {
  beforeEach(() => {
    let div = document.createElement('div');
    div.setAttribute('id', 'login-modal-body');
    document.body.appendChild(div);
    view = new View();
  });
  afterEach(() => {
    let div = document.getElementById('login-modal-body')
    document.body.removeChild(div);
    view = undefined;
  });

  describe('form', () => {
    beforeEach(() => {
      view._buildModal();
    });
    // afterEach(() => {
    // });
    it('should have three input field', () => {
      let inputs = document.getElementsByTagName('input');
      expect(inputs.length).toBe(3);
    });
  });

  describe('Google link', () => {
    beforeEach(() => {
      a = document.getElementsByTagName('a');
      view._buildModal();
    });
    afterEach(() => {
      a = undefined;
    });

    it('should exist', () => {
      expect(a.length).toBe(1);
    });
    it('should point to URL where BACKEND_BASE_URL is pointing for authenticating', () => {
      let a = document.getElementsByTagName('a');
      expect(a[0].href).toBe(BACKEND_BASE_URL + 'users/auth/google_oauth2');
    });

  });
});
