var expect = require('chai').expect;
var login = require( '../helpers/login' );
var constants = require( '../helpers/constants' );
var uuidV4 = require('uuid/v4');


var new_campaign_name = uuidV4( );
var new_campaign_description = uuidV4( );
var updated_campaign_description = uuidV4( );
var sample_user_list = ['00-4005647','10-9901345','75-4867284','08-5947050','92-3068602','09-8017503','84-0863381'];
var user_logged_in = false;
var class_urn;

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

describe('Class Setup Tool', function() {

	before( function ( ) {
		login( browser );		
		browser.url('/navbar/classes/');
		$('#classtable > tbody > tr:nth-child(1) > td.sorting_1').waitForText( constants.waitTimeout );
	} );

	describe( 'Class Setup Tool', function( ) {
		it( 'should be able to load data', function( ) {
			var class_name = $('#classtable > tbody > tr:nth-child(1) > td.sorting_1').getText();
			expect( class_name ).to.not.equal( '' );
		} );

		it( 'should be able to create a new class', function( ) {	
			$( '#new_class_button' ).click( );
			$( '#curriculum-name-group' ).waitForVisible( constants.waitTimeout );
			$( '#inputSubject' ).selectByValue( 'ids' );
			class_urn = $( '#inputClassUrn' ).getValue( );
			$( '#createbutton' ).click( );
			browser.waitUntil(function () {
		      return $( '#subtitle' ).getText( ) === 'privileged'
		    }, constants.waitTimeout, constants.textChangeTimeout );		
		} );

		it( 'should be able to delete a campaign from the new class', function( ) {		
			$( '#accordion > div:nth-child(1) > div.panel-heading > h4 > span' ).click( );
			$( '#campaigntable > thead > tr > th:nth-child(1)' ).waitForVisible( );
			deleteACampaignAndWait( 5 );
		    $( '#accordion > div:nth-child(1) > div.panel-heading > h4 > span' ).click( );
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
	} );

	describe( 'Campaign Manager', function( ) {
		it( 'should be able to create a new campaign in the new class', function( ) {
			browser.url( '/navbar/author/' );
			$( 'body > div.container > div > div.col-md-12.page-header > h1' ).waitForVisible( );
			$( '#campaign_name_field' ).setValue( new_campaign_name );
			$( '#class_urn_field' ).selectByValue( class_urn );
			$( '#campaign_description' ).setValue( new_campaign_description );
			$( 'body > div.container > div > div.col-md-5.col-lg-4 > div > div.panel.panel-default > form > div:nth-child(4) > div > div > div > span.bootstrap-switch-label' )
				.click();
			$( '#upload_xml_button' ).chooseFile( constants.specsDir + '/files/Snack.xml' );
			$( '#surveygroup > div' ).waitForVisible( );
			var panel_heading = $( '#surveygroup > div > div.panel-heading > h4 > a' ).getText( );
			expect( panel_heading ).to.equal( 'Survey: Snack' );
			$( '#create_campaign_button' ).click( );			
			// hack to wait for the alert to show up.. waitUntil with alertText doesn't work very well!
 			browser.pause( constants.pauseTimeout );
		    browser.alertAccept();
		    browser.url('/navbar/campaigns/');
			browser.waitForVisible('#campaigntablebody');
			browser.setValue( '#campaigntable_filter > label > input[type="search"]', new_campaign_name );
			expect( $('#campaigntablebody > tr > td.sorting_1' ).getText() )
				.to.equal( new_campaign_name );				
		} );

		it( 'should be able to update the settings for a campaign in the new class', function( ) {
			$( '#campaigntablebody > tr > td.buttontd > div > button:nth-child(2)' ).click( );
			$( '#campaigntablebody > tr > td.buttontd > div > ul > li:nth-child(10) > a' ).waitForVisible( );		
			$( '#campaigntablebody > tr > td.buttontd > div > ul > li:nth-child(10) > a' ).click( );
			$( '#campaign_description' ).waitForVisible( );
			$( '#campaign_description' ).setValue( updated_campaign_description );
			$( '#campaign_save_button' ).click( );
			browser.waitUntil(function () {
			  return $( '#campaign_description' ).isVisible( ) === false
			}, constants.waitTimeout, constants.textChangeTimeout );	
			browser.refresh( );
			$( '#campaigntablebody' ).waitForVisible( );
			$( '#campaigntable_filter > label > input[type="search"]' ).setValue( new_campaign_name );
			$( '#campaigntablebody > tr' ).waitForVisible( );
			$( '#campaigntablebody > tr' ).click( );
			$( '#campaigntablebody > tr:nth-child(2) > td > div > div:nth-child(1) > p:nth-child(3) > i' )
				.waitForVisible( );
			var campaign_description = $( '#campaigntablebody > tr:nth-child(2) > td > div > div:nth-child(1) > p:nth-child(3) > i' )
				.getText( );
			expect( campaign_description ).to.equal( updated_campaign_description );
		} );

		it( 'should be able to delete a campaign in the new class', function( ) {
			$( '#campaigntablebody > tr > td.buttontd > div > button:nth-child(2)' ).click( );
			$( '#campaigntablebody > tr > td.buttontd > div > ul > li:nth-child(10) > a' ).waitForVisible( );	
			$( '#campaigntablebody > tr > td.buttontd > div > ul > li:nth-child(10) > a' ).click( );
			$( '#campaign_delete_button' ).waitForVisible( );
			$( '#campaign_delete_button' ).click( );
 			browser.pause( constants.pauseTimeout );
		    browser.alertAccept();
			browser.refresh( );
			$( '#campaigntablebody' ).waitForVisible( );
			$( '#campaigntable_filter > label > input[type="search"]' ).setValue( new_campaign_name );
			$( '#campaigntablebody > tr' ).waitForVisible( );
			$( '#campaigntablebody > tr > td' ).click( );
			expect( $( '#campaigntablebody > tr > td' ).getText( ) ).to.equal( 'No matching records found' );
		} ); 
	} );

	describe( 'Class Setup Tool', function( ) {
		it( 'should be able to delete the class', function( ) {
			browser.url( '/navbar/classes/editclass.html#' + class_urn );
			browser.waitUntil(function () {
		      return $( '#subtitle' ).getText( ) === 'privileged'
		    }, constants.waitTimeout, constants.textChangeTimeout );			
			classCleanup( );
			$( '#class_delete_button' ).click( );
	 		browser.waitUntil( function( ){
			  return browser.alertText( );
			}, constants.waitTimeout, constants.textChangeTimeout );
	        browser.alertAccept( );	    			
			$( '#new_class_button' ).waitForVisible( );
			$( '#classtable_filter > label > input' ).setValue( 'ids p1 bot' );
			$( '#classtable > tbody > tr > td' ).waitForText( );
			expect( $( '#classtable > tbody > tr > td' ).getText( ) ).to.equal( 'No matching records found' );
		} );
	} );
});