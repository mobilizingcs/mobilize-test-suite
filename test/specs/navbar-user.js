var login = require( '../helpers/login' );

describe('User', function() {
    it('should be able to log in', function () {
    	login( browser );
    });

    it( 'should be able to log out', function (){
    	browser.click('#nav-username');
    	browser.waitForVisible( '#logoutlink a' );
    	browser.click( '#logoutlink a' );
    } );

});