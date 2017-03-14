/**
 * @file Unit tests for view module in file navigationView.js.
 * @license GPL v2
 * @version 1.00
 */

describe('Navigation view', function() {
  beforeEach(function() {
    let nav = document.createElement('nav');
    let ul = document.createElement('ul');
    nav.appendChild(ul);
    document.body.appendChild(nav);
    navigationview = new NavigationView();
  });
  afterEach(function() {
    let navs = document.getElementsByTagName('nav');
    document.body.removeChild(navs[0]);
    navigationview = undefined;
  });

  it('should be empty if nothing has been built', function() {
    let nav = document.getElementsByTagName('nav');
    expect(nav.length).toBe(1);
  })
  it("should have 'Kirjautuminen' in the nav after Guest view has been built", function() {
    navigationview._buildGuest();
    let links = document.getElementsByTagName('a');
    expect(links.length).toBe(1);
    expect(links[0].innerHTML).toBe('Kirjautuminen');
  });

  describe('when user has logged in', function() {
    beforeEach(function() {
      session = new Session();
      document.cookie = 'userFirstName=Testaaja';
      navigationview._buildUser();
      links = document.getElementsByTagName('a');
    });
    afterEach(function() {
      session = undefined;
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
      expect(links[1].href).toBe(FRONTEND_BASE_URL + 'kurssihallinta.html');
    })
    it('should display a link named "Omat kurssit"', function() {
      expect(links[2].innerHTML).toBe('Omat kurssit');
    });
    it('should have "Omat kurssit" pointing to the correct URL', function() {
      expect(links[2].href).toBe(FRONTEND_BASE_URL + 'omat_kurssit.html');
    })
    it('should display a link named "Kirjaudu ulos"', function() {
      expect(links[3].innerHTML).toBe('Kirjaudu ulos');
    });
    it('should have "Kirjaudu ulos" pointing to the correct URL', function() {
      expect(links[3].href).toBe(BACKEND_BASE_URL + 'users/sign_out.html');
    })

  });
});
