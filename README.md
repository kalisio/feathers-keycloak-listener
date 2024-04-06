# feathers-keycloak-listener

## Usage

### Installation

````
$ yarn install
$ yarn link
````

### Example

#### Setup the service

Assuming you have setup a Feathers app:

````
// Import Feathers stufff
import { KeycloakListenerService } from '@kalisio/feathers-keycloak-listener'

// Setup Feathers app

const options = {
  ...
  app,
}

app.use('/api/keycloak_listener', new KeycloakListenerService(options))
````

## API

`feathers-keycloak-listener` consists in a single service that provides the following methods:

### constructor (options)

Create an instance of the service with the given options:

| Parameter | Description | Required |
| :--- | :--- | :--- |
| `app` | the feathers app | yes |

### create (data, params)

Notifies the listener of a Keycloak event.

See the **keycloak-custom-emitter**
project documentation for examples of
JSON sent with some event payloads.
