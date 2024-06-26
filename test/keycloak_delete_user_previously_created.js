// File: feathers-keycloak-listener/test/keycloak_delete_user_previously_created.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha keycloak_setUp.js

import { driver, context, intent, split } from './testutil.js';
import { By } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';

const KAPP_API_URL = process.env.KAPP_API_URL || 'http://localhost:8082';

const KAPP_ACCESS_TOKEN = context.getFromEnvOrFromCache('KAPP_ACCESS_TOKEN', 'kAppAccessToken');

// We must use another KAPP_ACCESS_TOKEN2, because KAPP_ACCESS_TOKEN will be
// unavailable as soon as we will suppress the "kalisio" account.

const KAPP_ACCESS_TOKEN2 = context.getFromEnvOrFromCache('KAPP_ACCESS_TOKEN2', 'kAppAccessToken2');

const cache = context.loadFromCache();
const USERNAME_TO_DELETE = cache.newUsername;

// FIXME With our accessToken, we are only able to suppress kalisio@kalisio.xyz!
// const USERNAME_TO_DELETE = 'kalisio';

var userCount0;
var userCount1;

describe('keycloak_delete_user_previously_created', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('sets up new user in Keycloak for integration tests with the kApp', (done) => {

		context.ready()

		// kApp: Retrieve the current userCount

		.then(context.execute(() => {
			fetch(KAPP_API_URL + '/api/users', {
				headers: { 'Authorization': 'Bearer ' + KAPP_ACCESS_TOKEN }
			})
			.then((response) => response.json())
			.then((data) => { userCount0 = data.total; });
		}))
		.then(() => driver.sleep(2000)) // Dirty hack because of an error in our control flow
		.then(() => {
			console.log('Checking that KAPP_ACCESS_TOKEN is valid...');
			expect(userCount0).to.be.a('number');
			console.log('Checking userCount0... (%d)...', userCount0);
			expect(userCount0).to.equal(userCount0);
		})

		.then(context.execute(() => {
			fetch('http://localhost:8082/api/users', {
				headers: { 'Authorization': 'Bearer ' + KAPP_ACCESS_TOKEN2 }
			})
			.then((response) => response.json())
			.then((data) => {
				const userCount = data.total;
				console.log('Checking that KAPP_ACCESS_TOKEN2 is valid...');
				expect(userCount0).to.be.a('number');
				console.log('Checking userCount... (%d)...', userCount);
				expect(userCount).to.equal(userCount0);
			});
		}))

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

		// Keycloak: FIXME: Set up the kApp accessToken(#2!) as custom attribute to the "keycloak-event-gateway" user
		// This is due to the fact that, as for now, there is no ability to
		// delete a user other than one’s self, in the database.

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
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).sendKeys(split(KAPP_ACCESS_TOKEN2)[0]))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.1.value']")).clear())
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.1.value']")).sendKeys(split(KAPP_ACCESS_TOKEN2)[1]))
			.then(() => context.takeScreenshot())

		.then(intent('Save the attributes'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'save-attributes']")).click())
			.then(() => driver.sleep(1000))
			.then(() => context.takeScreenshot())

		// Keycloak: Delete the "petitponey-RANDOM" user that was previously created
		
		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => context.takeScreenshot())

		.then(intent('Search for the user previously created'))
			.then(() => driver.findElement(By.xpath("//input[@aria-label = 'search']")).sendKeys(USERNAME_TO_DELETE))
			.then(() => driver.findElement(By.xpath("//button[@aria-label = 'Search']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Select the user'))
			.then(() => driver.findElement(By.xpath("//a[text() = '"
				+ USERNAME_TO_DELETE + "']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Deploy the action menu'))
			.then(() => driver.findElement(By.xpath("//div[@data-testid = 'action-dropdown']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Ask to delete the user'))
			.then(() => driver.findElement(By.xpath("//a[text() = 'Delete']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Confirm the user deletion'))
			.then(() => driver.findElement(By.xpath("//button[@id = 'modal-confirm']")).click())
			.then(() => driver.sleep(3000))
			.then(() => context.takeScreenshot())

		// Keycloak: FIXME: Set up back the kApp accessToken(#1!)...

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
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).sendKeys(split(KAPP_ACCESS_TOKEN)[0]))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.1.value']")).clear())
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.1.value']")).sendKeys(split(KAPP_ACCESS_TOKEN)[1]))
			.then(() => context.takeScreenshot())

		.then(intent('Save the attributes'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'save-attributes']")).click())
			.then(() => driver.sleep(1000))
			.then(() => context.takeScreenshot())

		// kApp: Test against userCount

		.then(context.execute(() => {
			fetch(KAPP_API_URL + '/api/users', {
				headers: { 'Authorization': 'Bearer ' + KAPP_ACCESS_TOKEN }
			})
			.then((response) => response.json())
			.then((data) => { userCount1 = data.total; });
		}))
		.then(() => driver.sleep(2000)) // Dirty hack because of an error in our control flow
		.then(() => {
			console.log('Checking userCount1... (%d)', userCount1);
			expect(userCount1).to.be.a('number');
			expect(userCount1).to.equal(userCount0 - 1);
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
