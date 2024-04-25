// File: feathers-keycloak-listener/test/keycloak_tearDown.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha keycloak_tearDown.js

import { driver, context, intent, takeScreenshotAndIncreaseCounter } from './testutil.js';
import { By } from 'selenium-webdriver';

describe('keycloak_tearDown', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('tears down the Keycloak configuration so we can run the tests again', (done) => {

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

		// Keycloak: Go back to the "Kalisio" realm

		.then(intent('Deploy the realm list'))
			.then(() => driver.findElement(By.id('realm-select')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Select the "Kalisio" realm'))
			.then(() => driver.findElement(By.xpath("//div[text() = 'Kalisio']")).click())
			.then(() => driver.sleep(1000)) // Wait so any notification eventually disappears
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Destroy the "Kalisio" realm

		.then(intent('Go to the realm settings'))
			.then(() => driver.findElement(By.id('nav-item-realm-settings')).click())
			.then(() => driver.sleep(10000)) // Wait so any notification eventually disappears
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Deploy the action menu'))
			.then(() => driver.findElement(By.xpath("//div[@data-testid = 'action-dropdown']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Ask to delete the realm'))
			.then(() => driver.findElement(By.xpath("//a[text() = 'Delete']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Confirm the realm deletion'))
			.then(() => driver.findElement(By.xpath("//button[@id = 'modal-confirm']")).click())
			.then(() => driver.sleep(3000))
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
