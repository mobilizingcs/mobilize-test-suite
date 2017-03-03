var Launcher = require('webdriverio').Launcher;
var fs = require('fs');
var archiver = require('archiver');

var env = process.env.ENV || 'prod';
var conf = {
	prod: {

	},
	dev: {
		mochaOpts: {
			timeout: 9999999
		},
		reporters: [ 'spec' ],
		reporterOptions: {

		}
	}
};

if( env === 'dev' ) {
	var spec = !!process.argv[ 2 ] ? process.argv[ 2 ] : null;
	if( !!spec ) {
		conf.dev[ 'suites' ] = {
	        dev: [ './test/specs/' + spec + '.js' ]
	    };
	    conf.dev[ 'suite' ] = 'dev';
	}
}

function getDate( currentdate ) {
	return currentdate.getDate() + "-"
            + (currentdate.getMonth()+1)  + "-" 
            + currentdate.getFullYear() + "-"  
            + currentdate.getHours() + "-"  
            + currentdate.getMinutes() + "-" 
            + currentdate.getSeconds();
}

var wdio = new Launcher("./wdio.conf.js", conf[ env ]);
wdio.run().then(function (code) {
	return code;
}, function (error) {
    console.error('Launcher failed to start the test', error.stacktrace);
    process.exit(1);
})
.then( function( code ) {
	if( env === 'prod' ) {
		var output = fs.createWriteStream( './report-' + getDate( new Date() ) + '.zip' );
		var archive = archiver( 'zip' );
		archive.pipe( output );
		archive.directory( './report/' );
		archive.finalize();
	}
} );