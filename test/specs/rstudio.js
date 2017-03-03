var expect = require('chai').expect;
var constants = require( '../helpers/constants' );

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

	it( 'should be able to test mobilizr package', function( ) {	

		$( '#rstudio_console_input > textarea' ).setValue(
				`devtools::install_github("mobilizingcs/mobilizr@beta",dependencies = TRUE)
				detach("package:mobilizr", unload=TRUE)
				file_dir <- "~/R/x86_64-pc-linux-gnu-library/"
				r.vers <- list.dirs(file_dir, full.names = FALSE, recursive = FALSE)
				r.vers <- as.numeric(r.vers)
				r.ver <- max(r.vers)
				location <- paste0(file_dir, r.ver, "/")
				library( "mobilizr", lib.loc= location )
				devtools::test( paste0( location, "mobilizr" ) )
				` );

		var interval = 5000; // milliseconds
		var max_tries = 60;

		var tries = 0;
		var last_output = 0;
		while( tries <= max_tries ) {
			var output = browser.execute( ( ) => {
				var output_children_length = document.getElementById( 'rstudio_console_output' ).children.length;
				return output_children_length;	
			} );
			output = output.value;
			if( last_output === output ) {
				break;
			}
			last_output = output;
			tries++;
			browser.pause( interval );
		}

		browser.saveScreenshot( constants.reportDir + '/rstudio-execution.png' );		
		if( tries > max_tries + 1 ) {
			// failed to finish execution within the stipulated tries and interval
			expect( false ).to.equal( true );
		}
		else {
			// execution finished within stipulated time
			var console_output = $('#rstudio_console_output').getText();
			// what should we test here?
			//console_output = console_output.split( "\n" );
			//console.log( '$' + console_output[console_output.length-1] + '$' );
		}

	} );

});