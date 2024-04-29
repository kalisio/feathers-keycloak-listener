_[Back to the home page](../README.md)
— Previous page: [feathers-keycloak-listener](../README.md)
— Next page: [2. API](./API.md)_


---

# 1. Installation and usage







## Installation

Prerequisites: Node, yarn

From this project directory:

````
$ yarn install
$ yarn link
````

## Link the module from your app


From your app folder:

````
$ yarn install
$ yarn link @kalisio/feathers-keycloak-listener
````


## Setup the service

Assuming you have setup a Feathers app:

````
// (... Import Feathers stuff)
import KeycloakListenerService from '@kalisio/feathers-keycloak-listener/lib/service.js'

...

app.use('/api/keycloak-events', new KeycloakListenerService({
	app: app
}))
````

This will actually do nothing apart from some
logging in the console.

To add some business logic, you will have to do this:

````
app.use('/api/keycloak-events', new KeycloakListenerService({
	app: app,
	triggers: [{
       eventClass: 'AdminEvent',
       operationType: 'CREATE',
       resourceType: 'USER',
       action: (event) => {
           console.log('Do something with: ' + event.representation.username)
       }
   }]
}))
````



---

_[Back to the home page](../README.md)
— Previous page: [feathers-keycloak-listener](../README.md)
— Next page: [2. API](./API.md)_
