var expect = require('chai').expect;
var constants = require( '../helpers/constants' );
var fs = require('fs');
var path = require( 'path' );

function writeStringToFile( string, file_path ) {
	fs.writeFileSync( file_path, string ); 
}

describe('RStudio', function() {

	before( function( ){
		browser.url( '/navbar/rstudio/' );
		$( '#caption' ).waitForVisible( );
		$( '#username' ).setValue( constants.ohmage_username );
		$( '#password' ).setValue( constants.ohmage_password );	
		$( '#buttonpanel > button > table > tbody > tr > td.inner' ).click( );
	} );

	it( 'should be able to load', function( ) {
		$('body > div:nth-child(4)').waitForVisible();
	} );

	it( 'should be able to test mobilizr package without any failures', function( ) {	
	  	this.timeout(350000);
		$( '#rstudio_console_input > textarea' ).setValue(
				`cat("\\014")
				setwd("/home/kapeel/temp/mobilizr")
				devtools::install( dependencies = TRUE )
				devtools::test()
				` );

		var interval = 5000; // milliseconds
		var max_tries = 60;

		var tries = 0;
		var last_output = 0;
		var constant_output_max_checks = 5;
		var constant_output_checks = 0;
		while( tries <= max_tries ) {
			var output = browser.execute( ( ) => {
				var output_children_length = document.getElementById( 'rstudio_console_output' ).children.length;
				return output_children_length;	
			} );
			output = output.value;
			if( last_output === output ) {
				constant_output_checks++;				
			}
			else {
				constant_output_checks = 0;
			}
			if( constant_output_checks >= constant_output_max_checks ) {
				break;
			}
			last_output = output;
			tries++;
			browser.pause( interval );
		}

		browser.saveScreenshot( constants.reportDir + path.normalize( '/rstudio-execution.png' ) );	
		if( tries > max_tries + 1 ) {
			// failed to finish execution within the stipulated tries and interval
			expect( false ).to.equal( true );
		}
		else {
			// execution finished within stipulated time
			var console_output = $('#rstudio_console_output').getText();			
			writeStringToFile( console_output, constants.reportDir + path.normalize( '/rstudio-execution.log' ) );			
			output_lines = console_output.split( "\n" );
			var failure_string = "Failed ---";
			for( var i = 0; i < output_lines.length; i++ ) {
				expect( output_lines[ i ].indexOf( failure_string ) ).to.not.equal( 0 );
			}
		}

	} );

});