var expect = require('chai').expect;
var login = require( '../helpers/login' );
var constants = require( '../helpers/constants' );

describe('Dashboard', function() {

	before( function() {
		login( browser );	
		browser.url('/navbar/dashboard/#urn:campaign:2017:idsorientation:timeuse');
		$('#data-count > span.filter-count').waitForVisible( constants.waitTimeout );
	} );

	it( 'should be able to load data', function( ) {
		var total_count = $( '#data-count > span.total-count' ).getText();
		expect(total_count).to.be.at.least( 73 );		
	} );

	it( 'should be able to filter data by username', function( ) {	
		var total_count = $( '#data-count > span.total-count' ).getText();
		expect(total_count).to.be.at.least( 73 );
		$( '#dropdowndiv > select' ).selectByValue( 'uclaids-11' );
		var filtered_count = $( '#data-count > span.filter-count' ).getText();
		filtered_count = !!filtered_count ? parseInt( filtered_count ) : 0;
		expect(filtered_count).to.equal( 16 );
		$( '#dropdowndiv > select' ).selectByVisibleText( 'All users' );
		filtered_count = $( '#data-count > span.total-count' ).getText();
		filtered_count = !!filtered_count ? parseInt( filtered_count ) : 0;		
		expect(filtered_count).to.equal( 73 );		
	} );

	it( 'should be able to toggle graphics windows on/off', function( ) {
		var graphicsTimeoutText = 'graphic failed to load';
		expect( $( '#bottompanel' ).isVisible( ) ).to.equal( true );
		$( '#timeseriesbutton' ).click( );
		expect( $( '#bottompanel' ).isVisible( ) ).to.equal( false );
		$( '#timeseriesbutton' ).click( );
		expect( $( '#bottompanel' ).isVisible( ) ).to.equal( true );

		expect( $( '#histpanel' ).isVisible( ) ).to.equal( false );
		$( '#histbutton' ).click( );
		expect( $( '#histpanel' ).isVisible( ) ).to.equal( true );

		expect( $( '#map' ).isVisible( ) ).to.equal( false );
		$( '#mapbutton' ).click( );
		expect( $( '#map' ).isVisible( ) ).to.equal( true );		
	} );
	
});