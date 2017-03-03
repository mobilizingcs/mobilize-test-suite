# Mobilize Test Suite

This package executes WebdriverIO-based functional, in-browser tests on the Mobilize platform. This allows school sites implementing MobilizingCS curriculums to run the test suite to ensure that the computers and networks at school sites are able to access the Mobilize platform tools.

### How to use

1. Make sure node >= v7.4.0 and an updated version of Google Chrome is installed
2. Clone the repository: `git clone https://github.com/mobilizingcs/mobilize-test-suite.git`
3. cd to the repository: `cd mobilize-test-suite`
4. Create a credentials.json file in the same directory (see below)
5. Install dependencies: `npm install`
6. Run the test suite: `node index.js`
7. A zipped test report is generated in the same directory: `report-{DATE}-{TIME}.zip`

#### `credentials.json` format
```
{
	"username": "{OHMAGE_USERNAME}",
	"password": "{OHMAGE_PASSWORD}"
}
```