# feathers-keycloak-listener

[![Latest Release](https://img.shields.io/github/v/tag/kalisio/feathers-keycloak-listener?sort=semver&label=latest)](https://github.com/kalisio/feathers-keycloak-listener/releases)
[![Build Status](https://github.com/kalisio/feathers-keycloak-listener/actions/workflows/main.yaml/badge.svg)](https://github.com/kalisio/feathers-keycloak-listener/actions/workflows/main.yaml)
[![Code Climate](https://codeclimate.com/github/kalisio/feathers-keycloak-listener/badges/gpa.svg)](https://codeclimate.com/github/kalisio/feathers-keycloak-listener)
[![Test Coverage](https://codeclimate.com/github/kalisio/feathers-keycloak-listener/badges/coverage.svg)](https://codeclimate.com/github/kalisio/feathers-keycloak-listener/coverage)
[![Download Status](https://img.shields.io/npm/dm/@kalisio/feathers-keycloak-listener.svg?style=flat-square)](https://www.npmjs.com/package/@kalisio/feathers-keycloak-listener)

> `feathers-keycloak-listener` facilitates the management of [Keycloak events](https://www.keycloak.org/docs-api/22.0.5/javadocs/org/keycloak/events/EventType.html) emitted by [keycloak-event-gateway](https://github.com/kalisio/keycloak-event-gateway) plugin.

## Usage

### Installation

```shell
npm install @kalisio/feathers-keycloak-listener --save
```

or

```shell
yarn add @kalisio/feathers-keycloak-listener
```

### Example

_TODO_


## API

#### constructor (options)

Create an instance of the service with the given options:

| Parameter | Description | Required |
|---|---|---|
|`usersServicePath` | the path to the `users` service. Default value is `users` | no |

#### create (data, params)

Handle an event forwarded by the [keycloak-event-gateway](https://github.com/kalisio/keycloak-event-gateway) plugin.

## Hooks

_TODO_

## License

Copyright (c) 2017-20xx Kalisio

Licensed under the [MIT license](LICENSE).

## Authors

This project is sponsored by 

[![Kalisio](https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-black-256x84.png)](https://kalisio.com)





