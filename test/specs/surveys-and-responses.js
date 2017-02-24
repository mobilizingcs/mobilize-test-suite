var expect = require('chai').expect;
var login = require( '../helpers/login' );

before( function() {
	login( browser );		
} );

describe( 'Survey taking tool', function( ){
	before( function( ) {
		browser.url('/navbar/survey');
		browser.waitForVisible('#list-region > nav > ul > li:nth-child(5)');		
	} );

	it( 'should be able to search for a campaign', function( ){
		$('#search-region > div > button').click();
		$('#search-box').setValue('test suite - snack');
		var text = $('#list-region > nav > ul > li > div > div:nth-child(3) > h3').getText();
		expect( text ).to.equal( 'Test Suite - Snack' );
	} );

	it( 'should be able to download the campaign', function( ){
		$( '#list-region > nav > ul > li > div > div:nth-child(3) > h3' ).click( );
		// run a negative test for this
		browser.waitUntil(function () {
		    return browser.getText('#list-region > nav > ul > li > div > div:nth-child(1) > button') === 'Unsave'
		}, 5000, 'expected text to be different after 5s');			
	} );

	it( 'should be able to start taking the survey', function( ){
		$( '#list-region > nav > ul > li > div' ).click( );
		$( '#list-region > nav > ul > li > div > div:nth-child(2)' ).click( );
	} )

	it( 'should be able to submit the survey', function( ){
		var dir = process.argv[1].replace( "node_modules/webdriverio/build/lib/runner.js", "" );
		dir += 'test/specs';
		$( '#choice-SnackPeriod-0' ).click( );
		$( '#step-body > div > div:nth-child(2) > div.step-body-region > div > form > div > textarea' ).setValue( 'Banana' );
		var btn = $( '#step-body > div > div:nth-child(3) > div.step-body-region > div > form > fieldset > div > button.increment' );
		btn.click();
		btn.click();
		$( '#choice-SnackLocation-3' ).click( );
		$( '#choice-WhoYouSnackWith-2' ).click( );
		$( '#step-body > div > div:nth-child(6) > div.step-body-region > div > form > div > textarea' ).setValue( 'Hunger' );
		$( '#choice-SnackCost-1' ).click( );
		$( '#step-body > div > div:nth-child(8) > div.step-body-region > div > form > div > div > div > input[type="file"]' ).chooseFile( dir + '/files/banana.jpeg' );
		$( '#next-button' ).click( );
		browser.waitUntil( function(){
			return browser.getText( '#step-body > div > h2' ) === 'Survey Submit';
		}, 5000, 'expected text to appear' );
		$( '#next-button' ).click( );
		browser.waitUntil( function(){
			return browser.getText( '#step-body > div > h2' ) === 'Survey Complete';
		}, 10000, 'expected text to appear' );
		$( '#next-button' ).click( );
	} );

	it( 'should be able to verify submitted survey', function( ){
		// todo
	} );
} );

describe('Response manager', function( ) {
	before( function( ) {
		browser.url('/navbar/responses/#urn:campaign:public:kapeel:testsuitesnack');
		browser.waitForVisible('#responsetablebody');
	} );

	it( 'should be able to load', function( ) {				
		var result = browser.execute( () => document.getElementById('responsetablebody').children.length );
		expect(result.value).to.be.at.least( 1 );
	} );

	it( 'should be able to search for a response', function( ) {		
		// todo
	} );

	it( 'should be able to share a response', function( ) {		
		// todo
	} );

	it( 'should be able to unshare a response', function( ) {
		// todo
	} )
});
