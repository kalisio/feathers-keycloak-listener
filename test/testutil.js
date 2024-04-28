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
	
	mochaContext: null,

	ready: () => Promise.resolve(),

	set: function(mochaContext) { this.mochaContext = mochaContext; },
	
	execute: (action) => () => new Promise(async (resolve, reject) => {
	
		await action();
		
		driver.then(resolve, reject);
	}),
	
	putIntoCache: (data) => {
		console.log('Storing cache into: cache.json...');
		if (fs.existsSync('cache.json')) {
			const cached = JSON.parse(fs.readFileSync('cache.json', { encoding: 'utf8' }));
			for (const [key, value] of Object.entries(data)) {
				cached[key] = value;
			}
			data = cached;
		}
		fs.writeFileSync('cache.json', JSON.stringify(data), { encoding: 'utf8' });
		
		return {
			log: () => {
				console.log('cache content: ', data);
			},
		};
	},
	
	loadFromCache: () => {
		console.log('Loading cache from: cache.json...');
		const json = fs.readFileSync('cache.json', { encoding: 'utf8' });
		return JSON.parse(json);
	},
	
	takeScreenshot: () => new Promise((resolve, reject) => {

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
	}),

	getFromEnvOrFromCache: (envVarName, cacheVarName) => {

		if (!process.env[envVarName] && !fs.existsSync('cache.json')) {
			console.error('*** ERROR. No cache.json file was found.');
			console.error('In that case, please set a %s environment variable to run this test.', envVarName);
			process.exit(1);
		}

		const value = process.env[envVarName] || context.loadFromCache()[cacheVarName];

		console.log('Using %s from the environment or from cache.json...', envVarName);
		console.log('%s: %s', envVarName, value);

		value
	},
};

export const intent = (message) => () => new Promise((resolve, reject) => {
	console.log('    intent: %s', message);
	resolve();
});

var screenshotCount = 0;

export const getAttributeValue = (by, attributeName, consume) => new Promise((resolve, reject) => {

	driver.findElement(by).getAttribute(attributeName).then((attributeValue) => {

		consume(attributeValue);
		
		resolve();
	});
});

export const split = (accessToken) => {

	const index = accessToken.indexOf('.');
	
	if (index === -1) {
	
		return [accessToken, ''];
		
	} else {
	
		return [accessToken.substring(0, index +1), accessToken.substring(index + 1)]
	}
};
