var Launcher = require('webdriverio').Launcher;
var fs = require('fs');
var archiver = require('archiver');

var env = process.env.ENV || 'prod';
var conf = {
	prod: {
		reporters: [ 'allure' ],
		reporterOptions: {
			allure: {
				outputDir: './report'
			}
		}
	},
	dev: {
		mochaOpts: {
			timeout: 9999999
		},
		reporters: [ 'spec' ]
	}
};

var additional_wdio_conf = conf[ env ];
var report_dir_name = 'devReport';
var report_dir_path = './devReport';

if( env === 'dev' ) {
	var spec = !!process.argv[ 2 ] ? process.argv[ 2 ] : null;
	if( !!spec ) {
		additional_wdio_conf[ 'suites' ] = {
	        dev: [ './test/specs/' + spec + '.js' ]
	    };
	    additional_wdio_conf[ 'suite' ] = 'dev';
	}
}
else if( env === 'prod' ) {
	report_dir_name = 'report-' + getDate( new Date() );
	report_dir_path = './reports/' + report_dir_name;
	additional_wdio_conf.reporterOptions.allure.outputDir = report_dir_path + '/allure';
	additional_wdio_conf.screenshotPath = report_dir_path + '/error-screenshots';
}

process.env.REPORT_DIR = report_dir_path;


var wdio = new Launcher("./wdio.conf.js", additional_wdio_conf);
console.log( 'Running Mobilize platform functional tests' );
env === 'prod' ? console.log( "Reports will be stored in '" + report_dir_path + "'" ) : null;
wdio.run().then(function (code) {
	return code;
}, function (error) {
    console.error('Launcher failed to start the test', error.stacktrace);
    process.exit(1);
})
.then( function( code ) {
	console.log( 'Test execution completed successfully.' )
	if( env === 'prod' ) {
		console.log( 'Generating test report.' );		
		var output = fs.createWriteStream( './' + report_dir_name + '.zip' );
		var archive = archiver( 'zip' );
		archive.pipe( output );
		archive.directory( report_dir_path + '/' );
		archive.finalize();
		output.on('close', function() {
		  console.log( 'Test report generated successfully: ' + report_dir_name + '.zip' );
		  process.exit( code );
		});		
	}
	else {
		process.exit( code );
	}
} );

function getDate( currentdate ) {
	return (currentdate.getMonth()+1)+ "-"
            + currentdate.getDate() + "-" 
            + currentdate.getFullYear() + "-"  
            + currentdate.getHours() + "-"  
            + currentdate.getMinutes() + "-" 
            + currentdate.getSeconds();
}