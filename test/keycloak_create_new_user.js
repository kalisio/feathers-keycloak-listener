// File: feathers-keycloak-listener/test/keycloak_create_new_user.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha keycloak_setUp.js

import { driver, context, intent } from './testutil.js';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';

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

var userCount0;
var userCount1;

describe('keycloak_create_new_user', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('sets up new user in Keycloak for integration tests with the kApp', (done) => {

		context.ready()

		// kApp: Retrieve the current userCount

		.then(context.execute(() => {
			fetch('http://localhost:8082/api/users', {
				headers: { 'Authorization': 'Bearer ' + KAPP_ACCESS_TOKEN }
			})
			.then((response) => response.json())
			.then((data) => { userCount0 = data.total; });
		}))
		.then(() => {
			console.log('Checking userCount0... (%d)', userCount0);
			expect(userCount0).to.be.a('number');
			expect(userCount0).to.equal(userCount0);
		})

		// Keycloak: Log in
		
		.then(intent('Keycloak: Login page'))
			.then(() => driver.navigate().to('http://localhost:8080/admin/master/console/'))
			.then(() => driver.sleep(3000))
			.then(() => context.takeScreenshot())

		.then(intent('Credentials'))
			.then(() => driver.findElement(By.id('username')).sendKeys('admin'))
			.then(() => driver.findElement(By.id('password')).sendKeys('adminp'))
			.then(() => context.takeScreenshot())

		.then(intent('Submit the login form'))
			.then(() => driver.findElement(By.id('kc-login')).click())
			.then(() => driver.sleep(3000))
			.then(() => context.takeScreenshot())

		// Keycloak: Go to the "Kalisio" realm

		.then(intent('Deploy the realm list'))
			.then(() => driver.findElement(By.id('realm-select')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Select the "Kalisio" realm'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Kalisio']")).click())
			.then(() => driver.sleep(1000)) // Wait so any notification eventually disappears
			.then(() => context.takeScreenshot())

		// Keycloak: Set up the kApp accessToken as custom attribute to the "keycloak-event-gateway" user

		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => context.takeScreenshot())

		.then(intent('Go to the keycloak-event-gateway user'))
			.then(() => driver.findElement(By.xpath("//td[@data-label = 'Username']/a[text() = 'keycloak-event-gateway']")).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Go to the Attributes tab'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'Attributes']")).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Fill in value for attribute: accessToken'))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).clear())
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).sendKeys(KAPP_ACCESS_TOKEN))
			.then(() => context.takeScreenshot())

		.then(intent('Save the attributes'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'save-attributes']")).click())
			.then(() => driver.sleep(1000))
			.then(() => context.takeScreenshot())

		// Keycloak: Add a "petitponey-RANDOM" user
		
		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => context.takeScreenshot())

		.then(intent('Ask to create a user'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the user form'))
			.then(() => driver.findElement(By.id('kc-username')).sendKeys(newUsername))
			.then(() => driver.findElement(By.id('kc-email')).sendKeys(newEmail))
			// Check "Email verified: YES"
			.then(() => driver.findElement(By.xpath("//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Submit the user form'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		// Keycloak: Set a password for the "petitponey-RANDOM" user

		.then(intent('Open the Credentials panel'))
			.then(() => driver.findElement(By.xpath("//a[@data-testid = 'credentials']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Ask to set the password'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'no-credentials-empty-action']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the password form'))
			.then(() => driver.findElement(By.id('password')).sendKeys(newPasswordInKeycloak))
			.then(() => driver.findElement(By.id('passwordConfirmation')).sendKeys(newPasswordInKeycloak))
			// Check "Temporary: NO"
			.then(() => driver.findElement(By.xpath("//div[@class = 'pf-l-bullseye']//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Submit the password form'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'confirm']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Confirm'))
			.then(() => driver.findElement(By.id('modal-confirm')).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		// kApp: Test against userCount

		.then(context.execute(() => {
			fetch('http://localhost:8082/api/users', {
				headers: { 'Authorization': 'Bearer ' + KAPP_ACCESS_TOKEN }
			})
			.then((response) => response.json())
			.then((data) => { userCount1 = data.total; });
		}))
		.then(() => driver.sleep(2000)) // Dirty hack because of an error in our control flow
		.then(() => {
			console.log('Checking userCount1... (%d)', userCount1);
			expect(userCount1).to.be.a('number');
			expect(userCount1).to.equal(userCount0 + 1);
		})
		
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
