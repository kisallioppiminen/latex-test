/**
 * @file Unit tests for view module in file view.js.
 * @license GPL v2
 * @version 1.00
 */

describe('Navigation view', function() {
  beforeEach(function() {
    var nav = document.createElement('nav');
    var ul = document.createElement('ul');
    nav.appendChild(ul);
    document.body.appendChild(nav);
  });
  afterEach(function() {
    var navs = document.getElementsByTagName('nav');
    document.body.removeChild(navs[0]);
  });

  it('should be empty if nothing has been built', function() {
    var nav = document.getElementsByTagName('nav');
    expect(nav.length).toBe(1);
  })
  it("should have 'Kirjautuminen' in the nav after Guest view has been built", function() {
    var navigationview = new NavigationView();
    navigationview.buildGuest();
    var links = document.getElementsByTagName('a');
    expect(links.length).toBe(1);
    expect(links[0].innerHTML).toBe('Kirjautuminen');
  });
  it('Should have User view when User view has been build', function() {
    // var session = new Session();
    // var navigationview = new NavigationView(session);
    // navigationview.buildUser();
    // var links = document.getElementsByTagName('a');
    // expect(links.length).toBe(3);
  });

});
