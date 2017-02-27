var Launcher = require('webdriverio').Launcher;

var env = 'prod';
env = !!process.env.ENV ? 'dev' : 'dev';

var conf = {
	prod: {

	},
	dev: {
		mochaOpts: {
			timeout: 9999999
		}
	}
}

var wdio = new Launcher("./wdio.conf.js", conf[ env ]);
wdio.run().then(function (code) {
    process.exit(code);
}, function (error) {
    console.error('Launcher failed to start the test', error.stacktrace);
    process.exit(1);
});