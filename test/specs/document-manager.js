var expect = require('chai').expect;
var login = require( '../helpers/login' );
var constants = require( '../helpers/constants' );
var request = require( 'request' );
var fs = require( 'fs' );

describe('Document Manager Tool', function() {

	before( function() {
		login( browser );	
		browser.url('/navbar/documents/');
		browser.waitForVisible('#documents');	
	} );

	it( 'should be able to load', function( ) {				
		browser.pause( constants.pauseTimeout );
		var result = browser.execute( () => $('#documents > tbody')[0].children.length );
		expect(result.value).to.be.at.least( 1 );
	} );

	it( 'should be able to search for documents', function( ) {		
		browser.setValue('#documents_filter > label > input[type="search"]', 'banana.jpeg');
		expect($('#documents > tbody > tr:nth-child(1) > td:nth-child(4)').getText())
			.to.equal( '2017-03-01 10:03:37' );
	} );

	it( 'should be able to trigger a download', function( ) {
		// trigger download... 
		$( '#documents > tbody > tr:nth-child(1) > td:nth-child(8) > form > input.btn.btn-primary' ).click( );
		browser.pause( constants.pauseTimeout );
		browser.url( 'chrome://downloads' );
		browser.pause( constants.pauseTimeout );
		browser.saveScreenshot( constants.reportDir + '/document-manager-download.png' );
	} );
	
});