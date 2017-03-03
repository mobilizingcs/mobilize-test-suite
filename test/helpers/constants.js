// Notes: 
// 	- All timeout values are in milliseconds

var rootDir = process.argv[1].replace( "node_modules/webdriverio/build/lib/runner.js", "" );
var credentials = require( '../../credentials.json' );
var reportDir = process.env.REPORT_DIR;

var constants = {
	textChangeTimeout: 'expected text to be different after 5s', // text for timeout messages
	textAppearTimeout: 'expected text to appear',
	waitTimeout: 5000, // timeout value for waitFor* calls

	pauseTimeout: 3000, // timeout 

	surveyWaitTimeout: 10000, // timeout for waitUntil after survey submission
	specsDir: rootDir + 'test/specs',

	ohmage_username: credentials.username,
	ohmage_password: credentials.password,

	reportDir: reportDir
};

module.exports = constants;