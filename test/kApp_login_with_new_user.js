// File: feathers-keycloak-listener/test/kApp_login_with_new_user.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha kApp_login_with_new_user.js

import { driver, context, intent, takeScreenshotAndIncreaseCounter } from './testutil.js';
import { By } from 'selenium-webdriver';

const cache = context.loadFromCache();

console.log('cache content: ', cache);

const EMAIL = cache.newEmail;
const PASSWORD_IN_KAPP = cache.newPasswordInKApp;

describe('kApp_login_with_new_user', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('logs in the kApp with the newly created user', (done) => {

		context.ready()

		// kApp: Log in

		.then(intent('Open the kApp'))
			.then(() => driver.navigate().to('http://localhost:8082/'))
			.then(() => driver.sleep(3000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Dismiss the modal dialog'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'OK']")).click())
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the login form'))
			.then(() => driver.findElement(By.id('email-field')).sendKeys(EMAIL))
			.then(() => driver.findElement(By.id('password-field')).sendKeys(PASSWORD_IN_KAPP))
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Actually log in'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Log in']")).click())
			.then(() => driver.sleep(3000))
			.then(() => takeScreenshotAndIncreaseCounter())

		// kApp: Log out

		.then(intent('Open the sidebar'))
			.then(() => driver.findElement(By.id('left-opener')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Log out'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Logout']")).click())
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
