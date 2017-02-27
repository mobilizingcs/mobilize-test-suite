var expect = require('chai').expect;
var login = require( '../helpers/login' );

describe('Campaign manager', function() {

	before( function() {
		login( browser );	
		browser.url('/navbar/campaigns/');
		browser.waitForVisible('#campaigntablebody');	
	} );

	it( 'should be able to load', function( ) {				
		var result = browser.execute( () => document.getElementById('campaigntablebody').children.length );
		expect(result.value).to.be.at.least( 25 );
	} );

	it( 'should be able to search for campaigns', function( ) {		
		browser.setValue('#campaigntable_filter > label > input[type="search"]', 'test suite - snack');
		expect($('#campaigntablebody > tr > td:nth-child(2)').getText())
			.to.equal( '2017-02-24 20:26:33' );
	} );

	it( 'should be able to create a new campaign', function( ) {
		// todo
	} );

	it( 'should be able to delete a campaign', function( ) {
		// todo
	} );

	it( 'should be able to update campaign settings', function( ) {
		// todo
	} )
	
});