// File: feathers-keycloak-listener/test/testutil.js
//
// Used by integration tests.

import { assert } from 'chai';
import webdriver from 'selenium-webdriver';
import { By } from 'selenium-webdriver';
import fs from 'fs';

export const driver = new webdriver.Builder()
	//.forBrowser('firefox')
	.withCapabilities(webdriver.Capabilities.firefox()) // Uses RemoteWebDriver
	.build();

export const context = {

	ready: () => Promise.resolve(),

	set: function(mochaContext) {
	
		this.mochaContext = mochaContext;
	},
	
	mochaContext: null,
};

export const intent = (message) => () => new Promise((resolve, reject) => {
	console.log('    intent: %s', message);
	resolve();
});

var screenshotCount = 0;

export const takeScreenshotAndIncreaseCounter = () => new Promise((resolve, reject) => {

	driver.takeScreenshot().then((data) => {
	
		++screenshotCount;
		const fileName = screenshotCount.toString().padStart(8, '0') + '.png';
		console.log('      -> screenshot: %s', fileName);
		if (!fs.existsSync('screenshots')) {
			fs.mkdirSync('screenshots');
		}
		const screenshotsDir = (context.mochaContext === null)
			? 'screenshots'
			: ('screenshots/' + context.mochaContext.test.parent.title);
		if (!fs.existsSync(screenshotsDir)) {
			fs.mkdirSync(screenshotsDir);
		}
		fs.writeFileSync(screenshotsDir + '/' + fileName, data, 'base64', (error) => {
			if (error) {
				console.log(error);
				assert.fail('While taking screenshot: ' + fileName);
				reject();
			}
		});

	}).then(resolve, reject);

});
