// File: feathers-keycloak-listener/test/kApp_login_as_kalisio_through_keycloak.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub 
//     $ npx mocha kApp_login_as_kalisio_through_keycloak.js

import { driver, context, intent, takeScreenshotAndIncreaseCounter } from './testutil.js';
import { By } from 'selenium-webdriver';

const cache = context.loadFromCache();

console.log('cache content: ', cache);

const EMAIL = 'kalisio@kalisio.xyz';
const PASSWORD_IN_KEYCLOAK = 'tutu';

describe('kApp_login_as_kalisio_through_keycloak', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('logs in the kApp with the newly created user', (done) => {

		context.ready()

		// Go to the kApp and log in as the new user through Keycloak

		.then(intent('Open the kApp'))
			.then(() => driver.navigate().to('http://localhost:8082/'))
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Dismiss the modal dialog'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'OK']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Choose "Login with Keycloak"'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Login with Keycloak ?']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the login form'))
			.then(() => driver.findElement(By.id('username')).sendKeys(EMAIL))
			.then(() => driver.findElement(By.id('password')).sendKeys(PASSWORD_IN_KEYCLOAK))
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Actually log in'))
			.then(() => driver.findElement(By.id('kc-login')).click())
			.then(() => driver.sleep(10000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Dismiss the modal dialog'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'OK']")).click())
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		// End

		.then(() => done())
		.catch((error) => {
			console.log(error);
			done(error);
		});
	});

	after((done) => {

		driver
			.then(() => driver.quit())
			.then(() => done())
			.catch((error) => {
				console.log(error);
				done(error);
			});
	});
});
