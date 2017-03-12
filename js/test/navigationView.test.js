/**
 * @file Unit tests for view module in file view.js.
 * @license GPL v2
 * @version 1.00
 */

describe('View', function() {
  describe('navigation module', function() {
    beforeEach(function() {
      // var fixture = '<nav><ul></ul></nav>'
      // document.body.insertAdjacentHTML('afterbegin', fixture);

      var nav = document.createElement('nav');
      var ul = document.createElement('ul');
      nav.appendChild(ul);
      document.body.appendChild(nav);
      
      var session = new Session();
      var navigationview = new NavigationView();
    });
    afterEach(function() {
      var navs = document.getElementsByTagName('nav');
      document.body.removeChild(navs[0]);
    });

    it('should be empty if nothing has been built', function() {
      // var nav = document.getElementsByTagName('nav');
      // expect(nav.children.length).toBe(1);
    })
    it("should have 'Kirjautuminen' in the nav after Guest view has been built", function() {
      // view.navigation.buildGuest();
    });
    it('Should have User view when User view has been build', function() {
      // view.navigation.buildUser();
    });
  });
});
