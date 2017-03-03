var expect = require('chai').expect;
var constants = require( './constants' );

function login( browser ) {
    browser.url( '/' )
    browser.waitForVisible( '#navbar-login' )
    browser.click( '#navbar-login' ) 
    browser.waitForVisible( '#username' )          	
    browser.setValue( '#username', constants.ohmage_username )
    browser.setValue( '#password', constants.ohmage_password )
    browser.click( '#login-submit' )
    browser.waitForVisible( '#nav-username' )
    var text = browser.getText( '#nav-username' );
    expect(text).to.equal( constants.ohmage_username );
}

module.exports = login;