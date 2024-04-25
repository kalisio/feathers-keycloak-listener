// File: feathers-keycloak-listener/test/keycloak_create_new_user.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha keycloak_setUp.js

import {
	driver,
	context,
	intent,
	takeScreenshotAndIncreaseCounter
} from './testutil.js';
import { By } from 'selenium-webdriver';

const KAPP_ACCESS_TOKEN = process.env.KAPP_ACCESS_TOKEN;

const newUsername = 'petitponey' + Math.random().toString(36).slice(2);
const newEmail = newUsername + '@gmail.com';
const newPasswordInKeycloak = 'tutu';
const newPasswordInKApp = newUsername + '-Pass;word1';

console.log('Using KAPP_ACCESS_TOKEN from the environment...');

context.putIntoCache({
	newUsername: newUsername,
	newEmail: newEmail,
	newPasswordInKeycloak: newPasswordInKeycloak,
	newPasswordInKApp: newPasswordInKApp,
}).log();

describe('keycloak_create_new_user', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('sets up new user in Keycloak for integration tests with the kApp', (done) => {

		context.ready()

		// Keycloak: Log in
		
		.then(intent('Keycloak: Login page'))
			.then(() => driver.navigate().to('http://localhost:8080/admin/master/console/'))
			.then(() => driver.sleep(3000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Credentials'))
			.then(() => driver.findElement(By.id('username')).sendKeys('admin'))
			.then(() => driver.findElement(By.id('password')).sendKeys('adminp'))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Submit the login form'))
			.then(() => driver.findElement(By.id('kc-login')).click())
			.then(() => driver.sleep(3000))
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Go to the "Kalisio" realm

		.then(intent('Deploy the realm list'))
			.then(() => driver.findElement(By.id('realm-select')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Select the "Kalisio" realm'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Kalisio']")).click())
			.then(() => driver.sleep(1000)) // Wait so any notification eventually disappears
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Set up the kApp accessToken as custom attribute to the "keycloak-event-gateway" user

		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Go to the keycloak-event-gateway user'))
			.then(() => driver.findElement(By.xpath("//td[@data-label = 'Username']/a[text() = 'keycloak-event-gateway']")).click())
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Go to the Attributes tab'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'Attributes']")).click())
			.then(() => driver.sleep(2000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in value for attribute: accessToken'))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).clear())
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).sendKeys(KAPP_ACCESS_TOKEN))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Save the attributes'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'save-attributes']")).click())
			.then(() => driver.sleep(1000))
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Add a "petitponey-RANDOM" user

		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Ask to create a user'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the user form'))
			.then(() => driver.findElement(By.id('kc-username')).sendKeys(newUsername))
			.then(() => driver.findElement(By.id('kc-email')).sendKeys(newEmail))
			// Check "Email verified: YES"
			.then(() => driver.findElement(By.xpath("//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Submit the user form'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Set a password for the "petitponey-RANDOM" user

		.then(intent('Open the Credentials panel'))
			.then(() => driver.findElement(By.xpath("//a[@data-testid = 'credentials']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Ask to set the password'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'no-credentials-empty-action']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the password form'))
			.then(() => driver.findElement(By.id('password')).sendKeys(newPasswordInKeycloak))
			.then(() => driver.findElement(By.id('passwordConfirmation')).sendKeys(newPasswordInKeycloak))
			// Check "Temporary: NO"
			.then(() => driver.findElement(By.xpath("//div[@class = 'pf-l-bullseye']//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Submit the password form'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'confirm']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Confirm'))
			.then(() => driver.findElement(By.id('modal-confirm')).click())
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
