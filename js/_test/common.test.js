describe('Document.cookie', function() {
  beforeEach(function() {
    document.cookie = 'userId=7';
    document.cookie = 'userFirstName=Matti';
    document.cookie = 'test=testcase';
  });

  afterEach(function() {
    document.deleteCookie('userId');
    document.deleteCookie('userFirstName');
    document.deleteCookie('test=testcase');
  });

  it('should set cookie correctly', function () {
    expect(document.getCookie('userId')).toBe('7');
    expect(document.getCookie('userFirstName')).toBe('Matti');
    expect(document.getCookie('test')).toBe('testcase');
  });

  it('should get cookie correctly', function() {
    expect(document.getCookie('test')).toBe('testcase');
    expect(document.getCookie('kissa')).toBeUndefined();
  });

  it('should delete cookie correctly', function() {
    document.deleteCookie('userId');
    expect(document.getCookie('userId')).toBeUndefined();
    expect(document.getCookie('userFirstName')).toBe('Matti');
    expect(document.getCookie('test')).toBe('testcase');
  });

});

// describe('Document.cookie', function() {
//   beforeEach(function() {
//     HTMLDocument = 'undefined';
//
//     document.cookie = 'userId=7';
//     document.cookie = 'userFirstName=Matti';
//     document.cookie = 'test=testcase';
//   });
//
//   afterEach(function() {
//     document.deleteCookie('userId');
//     document.deleteCookie('userFirstName');
//     document.deleteCookie('test=testcase');
//   });
//
//   it('should set cookie correctly', function () {
//     expect(document.cookie).toBe('userId=7; userFirstName=Matti; test=testcase');
//   });
//
//   it('should get cookie correctly', function() {
//     expect(document.getCookie('test')).toBe('testcase');
//     expect(document.getCookie('kissa')).toBeUndefined();
//
//   });
//
//   it('should delete cookie correctly', function() {
//     document.deleteCookie('userId');
//     expect(document.cookie).not.toBe('userId=7; userFirstName=Matti; test=testcase');
//     expect(document.cookie).toBe('userFirstName=Matti; test=testcase');
//   });
//
// });
