var expect = require('chai').expect;
var login = require( '../helpers/login' );
var constants = require( '../helpers/constants' );

describe('Class Setup Tool', function() {

	function deleteACampaignAndWait( current_count ) {
		$( '#campaigntable > tbody > tr:nth-child(1) > td:nth-child(5) > button' ).click( );
		browser.waitUntil(function () {
	      return $( '#campaigntable > tbody > tr:nth-child(' + current_count + ')' ).isVisible( ) === false
	    }, constants.waitTimeout, constants.textChangeTimeout );
	}

	function deleteAUserAndWait( user_id ) {
		$( '#usertable_filter > label > input' ).setValue( user_id );
		browser.waitUntil( function( ){
			return $( '#usertable > tbody > tr > td:nth-child(3)' ).getText( ) === user_id
		}, constants.waitTimeout, constants.textChangeTimeout );
		$( '#usertable > tbody > tr > td:nth-child(8) > button' ).click( );
		if (browser.alertText()) {
        	browser.alertAccept();
    	}
    	browser.waitUntil( function( ){
			return 	$( '#usertable > tbody > tr > td' ).getText( ) === 'No matching records found'
		}, constants.waitTimeout, constants.textChangeTimeout );
		$( '#usertable_filter > label > input' ).setValue( '' );
	}

	var sample_user_list = ['00-4005647','10-9901345','75-4867284','08-5947050','92-3068602','09-8017503','84-0863381'];

	before( function() {
		login( browser );	
		browser.url('/navbar/classes/');
	} );

	it( 'should be able to load data', function( ) {
		$('#classtable > tbody > tr:nth-child(1) > td.sorting_1').waitForText( constants.waitTimeout );	
		var class_name = $('#classtable > tbody > tr:nth-child(1) > td.sorting_1').getText();
		expect( class_name ).to.not.equal( '' );
	} );

	it( 'should be able to create a new class', function( ) {	
		$( '#new_class_button' ).click( );
		$( '#curriculum-name-group' ).waitForVisible( constants.waitTimeout );
		$( '#inputSubject' ).selectByValue( 'ids' );
		$( '#createbutton' ).click( );
		browser.waitUntil(function () {
	      return $( '#subtitle' ).getText( ) === 'privileged'
	    }, constants.waitTimeout, constants.textChangeTimeout );		
	} );

	it( 'should be able to delete a campaign from the new class', function( ) {		
		$( '#accordion > div:nth-child(1) > div.panel-heading > h4 > a' ).click( );
		$( '#campaigntable > thead > tr > th:nth-child(1)' ).waitForVisible( );
		deleteACampaignAndWait( 5 );
	    $( '#accordion > div:nth-child(1) > div.panel-heading > h4 > a' ).click( );
	    browser.waitUntil(function () {
	      return $( '#collapseOne > div' ).isVisible( ) === false
	    }, constants.waitTimeout, constants.textChangeTimeout );	
	} );

	it( 'should be able to import users', function( ) {
		$( '#importpanel' ).click( );
		$('#collapseTwo > div > div:nth-child(1) > form > div > div > div.input-group > div.input-group-btn > div').waitForVisible();
		$( '#input-csv' ).chooseFile( constants.specsDir + '/files/sample_class.csv' );
		$('.file-preview-text').waitForVisible( );
		$( '#import_first_name' ).selectByValue( 'first_name' );
		$( '#import_last_name' ).selectByValue( 'last_name' );
		$( '#import_id' ).selectByValue( 'id' );
		$( '#import_organization' ).selectByValue( 'school' );		
		$( '#import_prefix' ).setValue( 'bot-' );
		$( '#importbutton' ).click( );
		$('#errordiv > div').waitForVisible();
		expect( $('#errordiv > div').getText() ).to.equal( '×\nAll done! Added 7 new users.' );
	} );
	
	it( 'should be able to search and delete a user', function( ) {		
		var user_id = sample_user_list.pop( );
		deleteAUserAndWait( user_id );
	} );

	// todo: describe campaign manager here!

	function classCleanup( ) {
		// delete all the remaining users
		while( sample_user_list.length > 0 ) {
			var user_id = sample_user_list.pop( );
			deleteAUserAndWait( user_id );
		}

		// delete all the remaining campaigns
		$( '#accordion > div:nth-child(1) > div.panel-heading > h4 > a' ).click( );
		$( '#campaigntable > thead > tr > th:nth-child(1)' ).waitForVisible( );
		deleteACampaignAndWait( 4 );
		deleteACampaignAndWait( 3 );
		deleteACampaignAndWait( 2 );
		deleteACampaignAndWait( 1 );		
	    $( '#accordion > div:nth-child(1) > div.panel-heading > h4 > a' ).click( );
	}

	it( 'should be able to delete the class', function( ) {
		classCleanup( );
		$( '#class_delete_button' ).click( );
 		if( browser.alertText( ) ) {
        	browser.alertAccept( );
    	}		
		$( '#new_class_button' ).waitForVisible( );
		$( '#classtable_filter > label > input' ).setValue( 'ids p1 bot' );
		$( '#classtable > tbody > tr > td' ).waitForText( );
		expect( $( '#classtable > tbody > tr > td' ).getText( ) ).to.equal( 'No matching records found' );
	} );
});