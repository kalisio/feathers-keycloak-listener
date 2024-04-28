// File: feathers-keycloak-listener/test/kApp_login_as_kalisio.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha kApp_login_as_kalisio.js

import { driver, context, intent } from './testutil.js';
import { By } from 'selenium-webdriver';

const KAPP_API_URL = process.env.KAPP_API_URL || 'http://localhost:8082';

const EMAIL = 'kalisio@kalisio.xyz';
const PASSWORD_IN_KAPP = 'Pass;word1';

describe('kApp_login_as_kalisio', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('logs in the kApp', (done) => {
	
		context.ready()
		
		// kApp: Log in

		.then(intent('Open the kApp'))
			.then(() => driver.navigate().to('http://localhost:8082/'))
			.then(() => driver.sleep(3000))
			.then(() => context.takeScreenshot())

		.then(intent('Dismiss the modal dialog'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'OK']")).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the login form'))
			.then(() => driver.findElement(By.id('email-field')).sendKeys(EMAIL))
			.then(() => driver.findElement(By.id('password-field')).sendKeys(PASSWORD_IN_KAPP))
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Actually log in'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Log in']")).click())
			.then(() => driver.sleep(3000))
			.then(() => context.takeScreenshot())

		// kApp: Log out

		.then(intent('Open the sidebar'))
			.then(() => driver.findElement(By.id('left-opener')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Log out'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Logout']")).click())
			.then(() => context.takeScreenshot())

		// kApp: Retrieve an access token that will be used in further tests

		.then(context.execute(() => {
			fetch(KAPP_API_URL + '/api/authentication', {
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
				body: JSON.stringify({
					strategy: 'local',
					email: 'kalisio@kalisio.xyz',
					password: 'Pass;word1'
				})
			})
			.then((response) => response.json())
			.then((data) => {
				context.putIntoCache({ kAppAccessToken: data.accessToken }).log();
			});
		}))

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
