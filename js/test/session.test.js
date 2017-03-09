/**
 * @file Unit tests for Session class in file session.js.
 * @license GPL v2
 * @version 1.00
 */


 describe('Cookie manager', function() {
   it('should try to ask backend if current user is logged in', function() {
     spyOn(session, "getSession");
     session.init();
     expect(session.getSession).toHaveBeenCalled();
   });

   describe('with a user session cookies', function() {
     beforeEach(function() {
       document.cookie = 'userId=3';
       document.cookie = 'userFirstName=Matti';
     });
     afterEach(function() {
       document.deleteCookie('userId');
       document.deleteCookie('userFirstName');
     });

     describe('and other cookie', function() {
       beforeEach(function() {
         document.cookie = 'otherCookie=someoneElseSetThisUp';
       });
       afterEach(function() {
         document.deleteCookie('otherCookie');
       });
       it('should delete userId and FirstName, but not other cookie', function() {
         session.logout();
         expect(document.cookie).toBe('otherCookie=someoneElseSetThisUp');
       });
       it('should recognize user as logged even if there are some other cookies', function() {
         expect(session.isLogged()).toBe(true);
       });
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
     it('should recognize user as logged', function() {
       expect(session.isLogged()).toBe(true);
     });
     it('should not recognize user as logged if there is no user id', function() {
       document.deleteCookie('userId');
       expect(session.isLogged()).toBe(false);
     });
     it("should not recognize user as logged if there is no user's first name", function() {
       document.deleteCookie('userFirstName');
       expect(session.isLogged()).toBe(false);
     });
     it('should not recognize user as logged if there are no cookies related to user', function() {
       document.deleteCookie('userId');
       document.deleteCookie('getUserFirstName');
       expect(session.isLogged()).toBe(false);
     });
     it('should not make contact with backend if user session cookies exist', function() {
       spyOn(session, 'getSession');
       session.init();
       expect(session.getSession).not.toHaveBeenCalled();
     });

   });
 });
