var expect = require('chai').expect;

function login( browser ) {
    browser.url( '/' )
    browser.waitForVisible( '#navbar-login' )
    browser.click( '#navbar-login' ) 
    browser.waitForVisible( '#username' )          	
    browser.setValue( '#username', 'site-testing' )
    browser.setValue( '#password', 'site-testing' )
    browser.click( '#login-submit' )
    browser.waitForVisible( '#nav-username' )
    var text = browser.getText( '#nav-username' );
    expect(text).to.equal( 'site-testing' );
}

module.exports = login;