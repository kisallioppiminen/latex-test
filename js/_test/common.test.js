describe('Document.cookie', function() {
    beforeEach(function() {
        session = new Session();
        document.cookie = 'userId=7';
        document.cookie = 'userFirstName=Matti';
        document.cookie = 'test=testcase';

    });

    afterEach(function() {
        document.deleteCookie('userId');
        document.deleteCookie('userFirstName');
        document.deleteCookie('test=testcase');
        session = undefined;
    });

    it('should set cookie correctly', function () {

        expect(document.cookie).toBe('userId=7; userFirstName=Matti; test=testcase');
    });

    it('should get cookie correctly', function() {

        expect(document.getCookie('test')).toBe('testcase');
        expect(document.getCookie('kissa')).toBeUndefined();

    });

    it('should delete cookie correctly', function() {
        document.deleteCookie('userId');
        expect(document.cookie).not.toBe('userId=7; userFirstName=Matti; test=testcase');
        expect(document.cookie).toBe('userFirstName=Matti; test=testcase');
    })

});

describe('Document.cookie', function() {
    beforeEach(function() {
        HTMLDocument = 'undefined';
        session = new Session();

        document.cookie = 'userId=7';
        document.cookie = 'userFirstName=Matti';
        document.cookie = 'test=testcase';

    });

    afterEach(function() {
        document.deleteCookie('userId');
        document.deleteCookie('userFirstName');
        document.deleteCookie('test=testcase');
        session = undefined;
    });

    it('should set cookie correctly', function () {

        expect(document.cookie).toBe('userId=7; userFirstName=Matti; test=testcase');
    });

    it('should get cookie correctly', function() {
        expect(document.getCookie('test')).toBe('testcase');
        expect(document.getCookie('kissa')).toBeUndefined();

    });

    it('should delete cookie correctly', function() {
        document.deleteCookie('userId');
        expect(document.cookie).not.toBe('userId=7; userFirstName=Matti; test=testcase');
        expect(document.cookie).toBe('userFirstName=Matti; test=testcase');
    })

});