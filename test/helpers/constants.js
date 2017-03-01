// Notes: 
// 	- All timeout values are in milliseconds

var rootDir = process.argv[1].replace( "node_modules/webdriverio/build/lib/runner.js", "" );

var constants = {
	textChangeTimeout: 'expected text to be different after 5s', // text for timeout messages
	textAppearTimeout: 'expected text to appear',
	waitTimeout: 5000, // timeout value for waitFor* calls

	surveyWaitTimeout: 10000, // timeout for waitUntil after survey submission
	specsDir: rootDir + 'test/specs'
};

module.exports = constants;