// File: feathers-keycloak-listener/test/keycloak_setUp.js
//
// Run these tests with the following commands:
//
//     $ docker-compose up -d
//     $ npm install
//     $ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
//     $ npx mocha keycloak_setUp.js

import { driver, context, intent, getAttributeValue } from './testutil.js';
import { By } from 'selenium-webdriver';

describe('keycloak_setUp', () => {

	// Do not use an arrow function, so we can use "this"
	before(function() { context.set(this); });

	it('sets up Keycloak for integration tests with the kApp', (done) => {

		context.ready()

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

		// Keycloak: Create a realm: "Kalisio"

		.then(intent('Deploy the realm list'))
			.then(() => driver.findElement(By.id('realm-select')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Add a realm'))
			.then(() => driver.findElement(By.xpath("//a[@data-testid = 'add-realm']")).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the realm form'))
			.then(() => driver.findElement(By.id('kc-realm-name')).sendKeys('Kalisio'))
			.then(() => context.takeScreenshot())
			
		.then(intent('Submit the realm form'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => driver.sleep(3000))
			.then(() => context.takeScreenshot())

		// Keycloak: Add the event listener to the "Kalisio" realm

		.then(intent('Go to the realm settings'))
			.then(() => driver.findElement(By.id('nav-item-realm-settings')).click())
			.then(() => context.takeScreenshot())
			
		.then(intent('Open the Events tab'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'Events']")).click())
			.then(() => context.takeScreenshot())
			
		.then(intent('Open the popup listbox'))
			.then(() => driver.findElement(By.xpath("//button[contains(@aria-labelledby, 'eventsListeners')]")).click())
			.then(() => context.takeScreenshot())
			
		.then(intent('Select: "keycloak-event-gateway" in the listbox'))
			.then(() => driver.findElement(By.xpath("//button[. = 'keycloak-event-gateway']")).click())
			.then(() => context.takeScreenshot())
			
		.then(intent('Toggle the popup listbox'))
			.then(() => driver.findElement(By.xpath("//button[contains(@aria-labelledby, 'eventsListeners')]")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Actually save the config'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'saveEventListenerBtn']")).click())
			.then(() => context.takeScreenshot())

		// Keycloak: Add a "keycloak-event-gateway" user

		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => context.takeScreenshot())

		.then(intent('Ask to create a user'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the user form'))
			.then(() => driver.findElement(By.id('kc-username')).sendKeys('keycloak-event-gateway'))
			// .then(() => driver.findElement(By.id('kc-email')).sendKeys(NO_EMAIL))
			// Check "Email verified: YES"
			.then(() => driver.findElement(By.xpath("//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Submit the user form'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		// Keycloak: Add custom attributes to the "keycloak-event-gateway" user

		.then(intent('Go to the Attributes tab'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'Attributes']")).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Ask to add a new attribute'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'attributes-add-row']")).click())
			.then(() => driver.sleep(1000))
			.then(() => context.takeScreenshot())

		.then(intent('Fill in attribute values'))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.key']")).sendKeys('accessToken.0'))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.0.value']")).sendKeys('abcde'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'attributes-add-row']")).click())
			.then(() => driver.sleep(500))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.1.key']")).sendKeys('accessToken.1'))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.1.value']")).sendKeys('f1234'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'attributes-add-row']")).click())
			.then(() => driver.sleep(500))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.2.key']")).sendKeys('keycloakEventHttpListenerUrl'))
			.then(() => driver.findElement(By.xpath("//input[@name = 'attributes.2.value']")).sendKeys('http://172.17.0.1:8082/api/keycloak-events'))
			.then(() => context.takeScreenshot())

		.then(intent('Save the attributes'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'save-attributes']")).click())
			.then(() => driver.sleep(1000))
			.then(() => context.takeScreenshot())

		// Keycloak: Add a "kalisio" user

		.then(intent('Go to the users page'))
			.then(() => driver.findElement(By.id('nav-item-users')).click())
			.then(() => driver.sleep(5000))
			.then(() => context.takeScreenshot())

		.then(intent('Ask to create a user'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the user form'))
			.then(() => driver.findElement(By.id('kc-username')).sendKeys('kalisio'))
			.then(() => driver.findElement(By.id('kc-email')).sendKeys('kalisio@kalisio.xyz'))
			// Check "Email verified: YES"
			.then(() => driver.findElement(By.xpath("//span[@class = 'pf-c-switch__toggle']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Submit the user form'))
			.then(() => driver.findElement(By.css('button.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		// Keycloak: Set a password for the "kalisio" user

		.then(intent('Open the Credentials panel'))
			.then(() => driver.findElement(By.xpath("//a[@data-testid = 'credentials']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Ask to set the password'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'no-credentials-empty-action']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the password form'))
			.then(() => driver.findElement(By.id('password')).sendKeys('tutu'))
			.then(() => driver.findElement(By.id('passwordConfirmation')).sendKeys('tutu'))
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

		// Keycloak: Create a new client, "moncoco"

		.then(intent('Go to the clients page'))
			.then(() => driver.findElement(By.id('nav-item-clients')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Ask to create a client'))
			.then(() => driver.findElement(By.css('a.pf-m-primary')).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the general settings'))
			.then(() => driver.findElement(By.id('clientId')).sendKeys('moncoco'))
			.then(() => context.takeScreenshot())

		.then(intent('Go to the next page'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'next']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Add client authentication'))
			.then(() => driver.findElement(By.xpath("//label[@for = 'kc-authentication-switch']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Go to the next page, again'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'next']")).click())
			.then(() => context.takeScreenshot())

		.then(intent('Fill in the client settings'))
			.then(() => driver.findElement(By.xpath("//input[@data-testid = 'redirectUris0']")).sendKeys('http://localhost:8082/*'))
			.then(() => driver.findElement(By.xpath("//input[@data-testid = 'webOrigins0']")).sendKeys('http://localhost:8082'))
			.then(() => context.takeScreenshot())

		.then(intent('Submit the client form'))
			.then(() => driver.findElement(By.xpath("//button[@data-testid = 'save']")).click())
			.then(() => context.takeScreenshot())

		// Keycloak: Get the client credentials for "moncoco"

		.then(intent('Go to the Credentials tab'))
			.then(() => driver.findElement(By.xpath("//span[text() = 'Credentials']")).click())
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

		.then(intent('Get the client\'s secret'))
			.then(() => getAttributeValue(By.id('kc-client-secret'), 'value', (clientSecret) => {
				context.putIntoCache({ clientSecret: clientSecret }).log();
			}))
			.then(() => driver.sleep(2000))
			.then(() => context.takeScreenshot())

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
