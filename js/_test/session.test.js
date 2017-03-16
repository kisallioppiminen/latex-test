/**
 * @file Unit tests for Session class in file session.js.
 * @license GPL v2
 * @version 1.00
*/

describe('Session manager', function() {
  beforeEach(function() {
    this.session = new Session();
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
  });
  afterEach(function() {
    this.session = undefined;
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
  });

  it('should not have any userId or userFirstName cookies at the begining', function() {
    expect(this.session.getUserId()).toBe(undefined);
    expect(this.session.getUserFirstName()).toBe(undefined);
  });
  it('should try to ask backend with method getSession() if current user is not logged in', function() {
    spyOn(this.session, "getSession");
    this.session.init();
    expect(this.session.getSession).toHaveBeenCalled();
    expect(this.session.getUserFirstName()).toBe(undefined);
  });
  it('should set cookies if getSession() returns current user with values', function() {

    class Backend {
      get() {
        return new Promise((resolve, reject) => {
          console.warn('Mocking');
          resolve({"has_sign_in": { "id": 1234, "first_name": "Weirdoman"}});
          reject(console.log('Something bad happened'));
        });
      }
    }

    backend = new Backend();
    this.session.getSession();
    setTimeout(function() {
      let forCookies = new Session();
      expect(forCookies.getUserId()).toBe('1234');
      expect(forCookies.getUserFirstName()).toBe('Weirdoman');
    }, 1);

    // waitsFor(function() {
    //   this.session.getSession();
    // }, "Cookies should be set after promise is resolved", 1000);

    // runs(function() {
    //   expect(document.cookie).toBe('Something else');
    // });

    // while (document.cookie == '') {
    //   console.warn('Documents are not set!' + document.cookie);
    // } 

    // expect(document.cookie).toBe('Something else');

    // expect(document.cookie).toBe('Something else');
    // expect(this.session.getUserFirstName()).toBe('Weirdoman');
    // expect(this.session.getUserId()).toBe(1234);
    // let userId = this.session.getUserId();
    // let userFirstName = session.getUserFirstName('userFirstName');
    // expect(document.cookie).toBe('something else');
//     expect(session.getUserId()).toBe('45');
//     expect(session.getUserFirstName()).toBe('Testaaja');
//     document.cookie = "";
//     backend = undefined;
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
        this.session.logout();
        expect(document.cookie).toBeTruthy();
      });
      it('should recognize user as logged even if there are some other cookies', function() {
        expect(this.session.isLogged()).toBe(true);
      });
    });

    it('should return a name from the cookie', function() {
      expect(this.session.getUserFirstName()).toBe('Matti');
    });
    it('should return an id from the cookie', function() {
      expect(this.session.getUserId()).toBe('3');
    });
    it('should delete userId and FirstName', function() {
      this.session.logout();
      expect(this.session.getUserFirstName()).not.toBeDefined();
      expect(this.session.getUserId()).not.toBeDefined();
    });
    it('should recognize user as logged', function() {
      expect(this.session.isLogged()).toBe(true);
    });
    it('should not recognize user as logged if there is no user id', function() {
      document.deleteCookie('userId');
      expect(this.session.isLogged()).toBe(false);
    });
    it("should not recognize user as logged if there is no user's first name", function() {
      document.deleteCookie('userFirstName');
      expect(this.session.isLogged()).toBe(false);
    });
    it('should not recognize user as logged if there are no cookies related to user', function() {
      document.deleteCookie('userId');
      document.deleteCookie('getUserFirstName');
      expect(this.session.isLogged()).toBe(false);
    });
    it('should not make contact with backend if user session cookies exist', function() {
      spyOn(this.session, 'getSession');
      this.session.init();
      expect(this.session.getSession).not.toHaveBeenCalled();
    });

  });
});


//
// describe('Session manager mocking', function() {
//   beforeEach(function() {
//     // this.session = new Session();
//   });
//   afterEach(function() {
//     // this.session = undefined;
//     // backend = undefined;
//   });
//   it('should set cookies if getSession() returns current user with values', () => {
//     // class Backend {
//     //   get(url) {
//     //     return new Promise((resolve, reject) => {
//     //       resolve({"has_sign_in": null});
//     //       reject();
//     //     });
//     //   }
//     // }
//
//     class Backend {
//       get(url) {
//         return new Promise((resolve, reject) => {
//           resolve({"has_sign_in": { "id": 45, "first_name": "Weirdoman"}});
//           reject(console.log('Something bad happened'));
//         });
//       }
//     }
//
//     let session = new Session();
//     let backend = new Backend();
//     this.session.getUserFirstName();
//     // let userId = this.session.getUserId();
//     // let userFirstName = session.getUserFirstName('userFirstName');
//     // expect(document.cookie).toBe('something else');
// //     expect(session.getUserId()).toBe('45');
// //     expect(session.getUserFirstName()).toBe('Testaaja');
// //     document.cookie = "";
// //     backend = undefined;
//   });
// //   it('should not set cookies if getSession() returns current user with key "has_sign_in" with value null', () => {
// });
