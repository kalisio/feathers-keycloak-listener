// File: feathers-keycloak-listener/test/integration_tests.sh
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub npx mocha integration_tests.js

import { assert } from 'chai';
import webdriver from 'selenium-webdriver';
import { By } from 'selenium-webdriver';
import fs from 'fs';

const driver = new webdriver.Builder()
	//.forBrowser('firefox')
	.withCapabilities(webdriver.Capabilities.firefox()) // Uses RemoteWebDriver
	.build();

const ready = () => Promise.resolve();

const intent = (message) => () => new Promise((resolve, project) => {
	console.log('    intent: ' + message);
	resolve();
});

var screenshotCount = 0;

const takeScreenshotAndIncreaseCounter = () => new Promise((resolve, reject) => {

	driver.takeScreenshot().then((data) => {

		++screenshotCount;
		const fileName = screenshotCount.toString().padStart(8, '0') + '.png';
		console.log('      -> screenshot: ' + fileName);
		if (!fs.existsSync('screenshots')) {
			fs.mkdirSync('screenshots');
		}
		fs.writeFileSync('screenshots/' + fileName, data, 'base64', (error) => {
			if (error) {
				console.log(error);
				assert.fail('While taking screenshot: ' + fileName);
				reject();
			}
		});

	}).then(resolve, reject);

});

const newEmail = 'petitponey' + Math.random().toString(36).slice(2) + '@gmail.com';

describe('integration_tests', () => {

	it('Make kApp and Keycloak interact', (done) => {

		ready()

		// kApp: Log in

		.then(intent('Open the kApp'))
			.then(() => driver.navigate().to('http://localhost:8082/'))
			.then(() => driver.sleep(3000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Dismiss the modal dialog'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'OK']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the login form'))
			.then(() => driver.findElement(By.id('email-field')).sendKeys('kalisio@kalisio.xyz'))
			.then(() => driver.findElement(By.id('password-field')).sendKeys('Pass;word1'))
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

		// Keycloak: Create a realm: "Kalisio"

		.then(intent('Deploy the realm list'))
			.then(() => driver.findElement(By.id('realm-select')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Add a realm'))
			.then(() => driver.findElement(By.xpath("//a[@data-testid = 'add-realm']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the realm form'))
			.then(() => driver.findElement(By.id('kc-realm-name')).sendKeys('Kalisio'))
			.then(() => takeScreenshotAndIncreaseCounter())
			
		.then(intent('Submit the realm form'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => driver.sleep(3000))
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Add the event listener to the "Kalisio" realm

		.then(intent('Go to the realm settings'))
			.then(() => driver.findElement(By.id('nav-item-realm-settings')).click())
			.then(() => takeScreenshotAndIncreaseCounter())
			
		.then(intent('Open the Events tab'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'Events']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())
			
		.then(intent('Open the popup listbox'))
			.then(() => driver.findElement(By.xpath("//button[contains(@aria-labelledby, 'eventsListeners')]")).click())
			.then(() => takeScreenshotAndIncreaseCounter())
			
		.then(intent('Select: "keycloak-event-gateway" in the listbox'))
			.then(() => driver.findElement(By.xpath("//button[. = 'keycloak-event-gateway']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())
			
		.then(intent('Toggle the popup listbox'))
			.then(() => driver.findElement(By.xpath("//button[contains(@aria-labelledby, 'eventsListeners')]")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Actually save the config'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'saveEventListenerBtn']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		// Keycloak: Add a "keycloak-event-gateway" user

		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Ask to create a user'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Fill in the user form'))
			.then(() => driver.findElement(By.id('kc-username')).sendKeys('keycloak-event-gateway'))
			// .then(() => driver.findElement(By.id('kc-email')).sendKeys(NO_EMAIL))
			.then(() => driver.findElement(By.xpath("//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Submit the user form'))
			.then(() => driver.findElement(By.css("button.pf-m-primary")).click())
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
			.then(() => driver.findElement(By.id('kc-username')).sendKeys('petitponey'))
			.then(() => driver.findElement(By.id('kc-email')).sendKeys(newEmail))
			.then(() => driver.findElement(By.xpath("//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => takeScreenshotAndIncreaseCounter())

		.then(intent('Submit the user form'))
			.then(() => driver.findElement(By.css("button.pf-m-primary")).click())
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
			.sleep(3000)
			.then(() => driver.quit())
			.then(() => done())
			.catch((error) => {
				console.log(error);
				done(error);
			});

	});

});
