_[Back to the home page](../README.md)
— Previous page: [1. Installation and usage](./Usage.md)
— Next page: [3. About Business Logic](./Business_Logic.md)_



--

# 2. API

## HTTP unique endpoint (`POST`)

The only way to trigger the HTTP service
is through a
`POST` request to the unique endpoint
you configured in your app. See [1. Installation and usage](Usage.md).

The dispatch is performed within the API
according to the data in the JSON payload itself.

## API Overview

The module consists in a single service 
`KeycloakListenerService`
that provides the following methods:

Generic methods:

* `constructor (options)`
* `create (data, params)` — a “catch all” method

Business logic methods with predefined events:

* `createUser (data)`
* `updateUser (data)`
* `deleteUser (data)`


See the 
[keycloak-event-gateway](https://github.com/kalisio/keycloak-event-gateway) 
project documentation for examples of
JSON sent by the Keycloak plugin.

## Generic methods

### `constructor (options)`

Create an instance of the service with the given options:

| Parameter | Description | Required |
| :--- | :--- | :--- |
| `app` | the feathers app | yes |

### `create (data, params)`

This “catch all” method.
notifies the listener of any event
sent by Keycloak.

## Business logic methods

### `createUser (data)`

This methods is triggered by the following
case:

* `eventClass=AdminEvent`
* `operationType=CREATE`
* `resourceType=USER`


### `updateUser (data)`

This methods is triggered by the following
case:

* `eventClass=AdminEvent`
* `operationType=UPDATE`
* `resourceType=USER`


### `deleteUser (data)`

This methods is triggered by the following
case:

* `eventClass=AdminEvent`
* `operationType=DELETE`
* `resourceType=USER`


--

_[Back to the home page](../README.md)
— Previous page: [1. Installation and usage](./Usage.md)
— Next page: [3. About Business Logic](./Business_Logic.md)_
