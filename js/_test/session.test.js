/**
 * @file Unit tests for Session class in file session.js.
 * @license GPL v2
 * @version 1.00
*/

describe('Session manager', function() {
  beforeEach(function() {
    // this.session = new Session();
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
  });
  afterEach(function() {
    // this.session = undefined;
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
  });

  it('should not have any userId or userFirstName cookies at the begining', function() {
    expect(Session.getUserId()).toBe(undefined);
    expect(Session.getUserFirstName()).toBe(undefined);
  });
  // it('should try to ask backend with method getSession() if current user is not logged in', function() {
  //   spyOn(this.session, "getSession");
  //   this.session.init();
  //   expect(this.session.getSession).toHaveBeenCalled();
  //   expect(this.session.getUserFirstName()).toBe(undefined);
  // });

  it('should set cookies if getSession() returns current user with values', function() {

    class Backend {
      get() {
        return new Promise((resolve) => {
          resolve({"has_sign_in": { "id": 1234, "first_name": "Weirdoman"}});
        });
      }
    }

    backend = new Backend();
    Session.getSession();
    setTimeout(function() {
      expect(Session.getUserId()).toBe('1234');
      expect(Session.getUserFirstName()).toBe('Weirdoman');
    }, 500);

  });

  it('should not set cookies, if session call to backend does not return user', function() {

    class Backend {
      get() {
        return new Promise((resolve) => {
          resolve({"has_sign_in": "null"});
        });
      }
    }

    backend = new Backend();
    Session.getSession();
    setTimeout(function() {
      expect(Session.getUserId()).toBe(undefined);
      expect(Session.getUserFirstName()).toBe(undefined);
    }, 500);

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
        Session.logout();
        expect(document.cookie).toBeTruthy();
      });
      it('should recognize user as logged even if there are some other cookies', function() {
        expect(Session.isLogged()).toBe(true);
      });
    });

    it('should return a name from the cookie', function() {
      expect(Session.getUserFirstName()).toBe('Matti');
    });
    it('should return an id from the cookie', function() {
      expect(Session.getUserId()).toBe('3');
    });
    it('should delete userId and FirstName', function() {
      Session.logout();
      expect(Session.getUserFirstName()).not.toBeDefined();
      expect(Session.getUserId()).not.toBeDefined();
    });
    it('should recognize user as logged', function() {
      expect(Session.isLogged()).toBe(true);
    });
    it('should not recognize user as logged if there is no user id', function() {
      document.deleteCookie('userId');
      expect(Session.isLogged()).toBe(false);
    });
    it("should not recognize user as logged if there is no user's first name", function() {
      document.deleteCookie('userFirstName');
      expect(Session.isLogged()).toBe(false);
    });
    it('should not recognize user as logged if there are no cookies related to user', function() {
      document.deleteCookie('userId');
      document.deleteCookie('getUserFirstName');
      expect(Session.isLogged()).toBe(false);
    });
    // it('should not make contact with backend if user session cookies exist', function() {
    //   spyOn(this.session, 'getSession');
    //   this.session.init();
    //   expect(this.session.getSession).not.toHaveBeenCalled();
    // });

  });
});
