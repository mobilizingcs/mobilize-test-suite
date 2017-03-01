var expect = require('chai').expect;
var login = require( '../helpers/login' );
var constants = require( '../helpers/constants' );

describe('Monitor tool', function() {

	before( function() {
		login( browser );	
		browser.url('/navbar/monitor/#urn:campaign:2017:idsorientation:timeuse');
		$('#info_text > a:nth-child(2) > span').waitForVisible( constants.waitTimeout );
	} );

	it( 'should be able to load data', function( ) {				
		$( '#info_text > a:nth-child(2) > span' ).click( );
		$( '#info_totalDate' ).waitForVisible( );
		var value = $( '#info_totalDate' ).getText();
		expect(value).to.be.at.least( 20 );
		$( '#info_modal > div > div > div.modal-footer > button' ).click();
	} );

	it( 'should be able to search for users', function( ) {	
		$( '#dynatable-query-search-user-table' ).waitForVisible( constants.waitTimeout, 'element failed to appear' );
		$( '#dynatable-query-search-user-table' ).setValue( 'uclaids-11' );
		$( '#dynatable-query-search-user-table' ).keys( 'Enter' );
		$( '#user-table > tbody > tr > td:nth-child(1)' )
			.waitForText( constants.waitTimeout, constants.textAppearTimeout );
		var value = $( '#user-table > tbody > tr > td:nth-child(6)' ).getText( );
		expect( value ).to.be.at.least( 16 );
		$( '#dynatable-query-search-user-table' ).setValue( '' );		
	} );

	it( 'should be able to load graphics', function( ) {
		var graphicsTimeoutText = 'graphic failed to load';
		$( '#activity-pie' ).waitForVisible( constants.waitTimeout, graphicsTimeoutText );
		$( '#privacy-pie' ).waitForVisible( constants.waitTimeout, graphicsTimeoutText );
		$( '#date-chart' ).waitForVisible( constants.waitTimeout, graphicsTimeoutText );
		$( '#client-pie-user' ).waitForVisible( constants.waitTimeout, graphicsTimeoutText );
		$( '#client-pie-resp' ).waitForVisible( constants.waitTimeout, graphicsTimeoutText );
	} );
	
});