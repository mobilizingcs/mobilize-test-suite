var expect = require('chai').expect;
var login = require( '../helpers/login' );
var constants = require( '../helpers/constants' );

describe('PlotApp', function() {

	before( function() {
		login( browser );	
		browser.url('/navbar/plotapp/#urn:campaign:2017:idsorientation:timeuse');
		$('#plotappsubtitle').waitForVisible( constants.waitTimeout );
	} );

	it( 'should be able to plot data', function( ) {				
		$( '#xfield' ).selectByValue( 'date' );
		$( '#yfield' ).selectByVisibleText( 'Responses (count)' );
		$( '#colorfield' ).selectByVisibleText( 'day' );
		$( '#plotbutton' ).click( );
		browser.pause( constants.waitTimeout - 2 * 3000 );
		$( '#plotdiv > div:nth-child(4)' ).waitForVisible( constants.waitTimeout + 5 );
		var bg_image = $( '#plotdiv > div:nth-child(4)' ).getCssProperty( 'background-image' );
		expect( bg_image ).to.not.equal( 'none' );
		expect( $( '#alertbox' ).isVisible( ) ).to.equal( false );
		expect( $( '#summarydiv > pre' ).getText( ) ).to.not.equal( '' );
		if( $( '#summarydiv > pre' ).getText( ) === '' ) {
			browser.debug( );
		}
	} );

	it( 'should be able to load the plot\'s png file', function( ) {	
		$( '#plotdiv > div:nth-child(4) > a:nth-child(4)' ).click( );
		var current_tab_id = browser.getCurrentTabId();
		var all_tab_ids = browser.getTabIds();
		var new_tab_id = all_tab_ids[ 0 ] === current_tab_id ? all_tab_ids[ 1 ] : all_tab_ids[ 0 ];
		browser.switchTab( new_tab_id );
		$( 'body > img' ).waitForVisible( constants.waitTimeout + 5 );
	} );

});