var expect = require('chai').expect;
var login = require( '../helpers/login' );
var uuidV4 = require('uuid/v4');
var constants = require( '../helpers/constants' );

before( function userLogin() {
	login( browser );		
} );

function visitCampaignPageAndWait( ) {
	browser.url('/navbar/responses/#urn:campaign:public:kapeel:testsuitesnack');
	browser.waitForVisible('#responsetablebody');
}

var snack_value = uuidV4( );

describe( 'Survey taking tool', function( ){
	before( function navigatesToSurvey( ) {
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
		// todo: run a negative test for this
		browser.waitUntil(function () {
		    return browser.getText('#list-region > nav > ul > li > div > div:nth-child(1) > button') === 'Unsave'
		}, constants.waitTimeout, constants.textChangeTimeout);			
	} );

	it( 'should be able to start taking the survey', function( ){
		$( '#list-region > nav > ul > li > div' ).click( );
		$( '#list-region > nav > ul > li > div > div:nth-child(2)' ).click( );
	} )

	it( 'should be able to submit the survey', function( ){
		$( '#choice-SnackPeriod-0' ).click( );
		$( '#step-body > div > div:nth-child(2) > div.step-body-region > div > form > div > textarea' ).setValue( snack_value );
		var btn = $( '#step-body > div > div:nth-child(3) > div.step-body-region > div > form > fieldset > div > button.increment' );
		btn.click();
		btn.click();
		$( '#choice-SnackLocation-3' ).click( );
		$( '#choice-WhoYouSnackWith-2' ).click( );
		$( '#step-body > div > div:nth-child(6) > div.step-body-region > div > form > div > textarea' )
			.setValue( 'Hunger' );
		$( '#choice-SnackCost-1' ).click( );
		$( '#step-body > div > div:nth-child(8) > div.step-body-region > div > form > div > div > div > input[type="file"]' )
			.chooseFile( constants.specsDir + '/files/banana.jpeg' );
		$( '#next-button' ).click( );
		browser.waitUntil( function(){
			return browser.getText( '#step-body > div > h2' ) === 'Survey Submit';
		}, constants.waitTimeout, constants.textAppearTimeout );
		$( '#next-button' ).click( );
		browser.waitUntil( function(){
			return browser.getText( '#step-body > div > h2' ) === 'Survey Complete';
		}, constants.surveyWaitTimeout, constants.textAppearTimeout );
		$( '#next-button' ).click( );		
	} );

	it( 'should be able to verify submitted survey', function( ){
		visitCampaignPageAndWait( );
		// sort by date - ascending
		$('#responsetable > thead > tr > th:nth-child(4)').click( );
		// sort by date - descending
		$('#responsetable > thead > tr > th:nth-child(4)').click( );
		var result = browser.execute( snack_value => {
			var children = document.getElementById('responsetablebody').childNodes;			
			var found = false;
			for( var i = 0; i < children.length; i++ ) {
				var child = children[ i ];
				child.click( );
				var value = child.nextSibling.childNodes[0].childNodes[0].childNodes[1].children[0].nextSibling.nodeValue;
				console.log(value,snack_value);
				if( value === snack_value ) {
					found = true;
					break;
				}
				child.click( );				
			}
			return found;
		}, snack_value );
		expect( result.value ).to.equal( true );		
	} );
} );

describe('Response manager', function( ) {
	before( visitCampaignPageAndWait );

	it( 'should be able to load', function( ) {				
		var result = browser.execute( () => document.getElementById('responsetablebody').children.length );
		expect(result.value).to.be.at.least( 1 );
	} );

	it( 'should be able to search for a response', function( ) {		
		$('#responsetable_filter > label > input[type="search"]').setValue( snack_value );
		var user = $('#responsetablebody > tr > td:nth-child(3)').getText( )
		expect( user ).to.equal( constants.ohmage_username );		
	} );

	it( 'should be able to share a response', function( ) {		
		// click the radio button
		$('#responsetablebody > tr > td:nth-child(1) > input').click();
		// click the Actions dropdown
		$('body > div > div > div.buttondiv.pull-left > div > div > button > span:nth-child(1)').click();
		browser.waitForVisible('#share_all_btn');
		$('#share_all_btn').click();
		browser.waitUntil(function () {
		    return $('#responsetablebody > tr > td:nth-child(5) > span').getText() === 'shared'
		}, constants.waitTimeout, constants.textChangeTimeout);		
	} );

	it( 'should be able to unshare a response', function( ) {
		// the radio button is clicked since the last test
		// click the Actions dropdown
		$('body > div > div > div.buttondiv.pull-left > div > div > button > span:nth-child(1)').click();
		browser.waitForVisible('#unshare_all_btn');
		$('#unshare_all_btn').click();
		browser.waitUntil(function () {
		    return $('#responsetablebody > tr > td:nth-child(5) > span').getText() === 'private'
		}, constants.waitTimeout, constants.textChangeTimeout);	
	} );

	it( 'should be able to delete a response', function( ) {
		// the radio button is clicked since the last test
		// click the Actions dropdown
		$('body > div > div > div.buttondiv.pull-left > div > div > button > span:nth-child(1)').click();
		browser.waitForVisible('#delete_all_btn');
		$('#delete_all_btn').click();
		browser.pause( 1000 );
		browser.alertAccept( );
		browser.waitUntil( function( ) { 
			return $( '#responsetablebody > tr' ).isVisible( ) === false;
		}, constants.waitTimeout, constants.textChangeTimeout );
	} );
});
