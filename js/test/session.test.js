/**
 * @file Yksikkötesti Session luokalle tiedostossa js/session.js.
 * @license GPL v2
 * @version 1.00
 */

describe('Cookie manager', function() {

  beforeEach(function() {
    session = new Session();
    document.cookie = 'userId=3';
    document.cookie = 'userFirstName=Matti';
    document.cookie = 'otherCookie=someoneElseSetThisUp';
  });

  afterEach(function() {

  });

  it('should return a name from the cookie', function() {
    expect(session.getUserFirstName()).toBe('Matti');
  });

  it('should return an id from the cookie', function() {
    expect(session.getUserId()).toBe('3');
  });

  it('should delete userId and FirstName', function() {
    session.logout();
    expect(session.getUserFirstName()).not.toBeDefined();
    expect(session.getUserId()).not.toBeDefined();
  });

  it('should delete userId and FirstName, but not other cookie', function() {
    session.logout();
    expect(document.cookie).toBe('otherCookie=someoneElseSetThisUp');
  });

});
