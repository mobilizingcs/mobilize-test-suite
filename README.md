# Mobilize Test Suite

This package executes WebdriverIO-based functional, in-browser tests on the Mobilize platform. This allows school sites implementing MobilizingCS curriculums to run the test suite to ensure that the computers and networks at school sites are able to access the Mobilize platform tools.

### How to use

1. Make sure node >= v7.4.0, python, Java and an updated version of Google Chrome is installed
2. If you want to run this on Windows, install [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) with `npm install -g windows-build-tools`
3. If you have git installed, clone the repository: `git clone https://github.com/mobilizingcs/mobilize-test-suite.git` (or download a zip file from this GitHub repo)
4. cd to the repository: `cd mobilize-test-suite`
5. Create a credentials.json file in the same directory (see below)
6. Install dependencies: `npm install`
7. Run the test suite: `node index.js`
8. A zipped test report is generated in the same directory: `report-{DATE}-{TIME}.zip`

#### `credentials.json` format
```
{
	"username": "{OHMAGE_USERNAME}",
	"password": "{OHMAGE_PASSWORD}"
}
```