/**
 * @file Session manager
 * @license GPL v2
 * @version 1.00
 */

 /**
  * @class
  */
class Session {

  /**
   * Define if user is logged with cookies. If user is not logged, asks the
   * backend if session exist. Function will set cookies if session exist. If
   * user can be defined as logged by cookies, there will be no queries to the
   * backend.
   *
   * @todo Make queries to the backend only when logging in or logging out.
   */
  static init() {
    if (!this.isLogged()) {
      this.getSession();
    } 
  } 

  /**
   * Asks backend if session exist. If it does, it will set cookies, so no
   * futher queries are necessary.
   */
  static getSession() {

    backend.get('user/get_session_user')
      .then(
        function fulfilled(data) {
          const session_user = data;

          if (session_user.has_sign_in !== null && session_user.has_sign_in !== undefined) {
            let newExpireTime = Session.getNewExpireTime(Session._getBackendSessionExpireInMs());

            document.cookie = 
              'userFirstName=' + session_user.has_sign_in.first_name + 
              '; expires=' + newExpireTime + 
              '; path=/';

            document.cookie = 
              'userId=' + session_user.has_sign_in.id + 
              '; expires=' + newExpireTime + 
              '; path=/';

            document.cookie = 
              'teacher=' + session_user.has_sign_in.teacher +
              '; expires=' + newExpireTime +
              '; path=/';

            document.cookie = 
              'student=' + session_user.has_sign_in.student +
              '; expires=' + newExpireTime + 
              '; path=/';
          }
        },
        function rejected() {
          console.warn('Could not retrieve session');
        }
      );
  }

  /**
   * Returns user's first name from cookie.
   *
   * @returns {String} User's first name.
   */
  static getUserFirstName() {
    return document.getCookie('userFirstName');
  } 

  /**
   * Returns user's ID from cookie.
   *
   * @returns {Number} User's ID.
   */
  static getUserId() {
    return document.getCookie('userId');
  }

  /**
   * @returns {Boolean} Is user teacher?
   */
  static isTeacher() {
    return document.getCookie('teacher');
  }

  /**
   * @returns {Boolean} Is user student?
   */
  static isStudent() {
    return document.getCookie('student');
  }

  /** 
   * Returns true if user is logged, else returns false. Use cookies to define
   * logging.
   */
  static isLogged() {
    return document.getCookie('userId') !== undefined && document.getCookie('userFirstName') !== undefined;
  }

  /**
   * Deprecated! Did not work as function call in onclick event, so now the
   * function is directly written inside the onclick event.
   */
  static logout() {
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
  }

  /**
   * Extends user's cookies expiring time to match with the backend.
   */
  static renew() {
    if (this.isLogged()) {
      let newExpireTime = this.getNewExpireTime(Session._getBackendSessionExpireInMs());

      let userFirstName = this.getUserFirstName();
      let isTeacher = this.isTeacher();
      let isStudent = this.isStudent();
      let userId = this.getUserId();

      document.deleteCookie(userFirstName);
      document.deleteCookie(userId);

      document.cookie = 
        'userFirstName=' + userFirstName + 
        '; expires=' + newExpireTime + 
        '; path=/';

      document.cookie = 
        'userId=' + userId + 
        '; expires=' + newExpireTime + 
        '; path=/';

      document.cookie = 
        'teacher=' + isTeacher + 
        '; expires=' + newExpireTime + 
        '; path=/';

      document.cookie = 
        'student=' + isStudent + 
        '; expires=' + newExpireTime + 
        '; path=/';
    } 
  }

  /**
   * Helper to get correct UTC time when extending cookies life.
   */
  static getNewExpireTime(newTime) {
    let now = new Date();
    let time = now.getTime();
    time += newTime;
    now.setTime(time);
    return now.toUTCString();
  }

  /**
   * @returns {Number} Milliseconds until backend session expires.
   */
  static _getBackendSessionExpireInMs() {
    const hours = 6;  // this value should always be the same as backend session
    return 3600 * 1000 * hours;
  }
}
