
_[Back to the home page](../README.md)
— Previous page: [5. How to deploy locally](Deploy.md)
— Next page: [7. Troubleshooting](Troubleshooting.md)_


--

# 6. How to test



## Run the tests

Prerequisites: Node, Docker.

```shell
$ cd test
$ docker-compose up -d
```


It deploys the following stack:

![Diagram](diagrams/png/feathers_keycloak_listener_test.png)

The sample Feathers
application we use in this environment
is 
Kalisio’s [kApp](https://kalisio.github.io/kApp/).


Then run:

```shell
$ npm install
$ export SELENIUM_REMOTE_URL=http://localhost:4444/wd/hub
$ npx mocha kApp_login_as_kalisio.js
```

This first test, `kApp_login_as_kalisio.js`,
logs in the kApp GUI and
checks that your kApp deployment is functional.

It also stores a kApp access token
in a local `cache.json` file.


> For information, is the way to get an access token for the kApp:
> 
> ````
> curl --location 'http://localhost:8082/api/authentication' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "strategy": "local",
         "email": "kalisio@kalisio.xyz",
         "password": "Pass;word1"
     }'
> ````

This second test, `keycloak_setUp.js`, 
logs in the Keycloak GUI, and
configures
Keycloak so you will be able to
log in the kApp through Keycloak
in a “Kalisio” realm;
It also adds the
[keycloak-event-gateway](https://github.com/kalisio/keycloak-event-gateway) listener
and uses the access token found previously.

Troubleshooting: If the creation of the
“Kalisio” realm fails — generally because you ran
the test twice in a row —, delete it in Keycloak
and run `npx mocha keycloak_setUp.js` again.

During this test, 
a `KEYCLOAK_CLIENT_SECRET` environment
variable will
be logged in the console.

Add it to the runtime context of your kApp’s
API and
restart the API.

Now you can continue to run the tests:

````
$ npx mocha kApp_login_as_kalisio_through_keycloak.js
````

This third test checks that the 
back-and-forth redirect URLs between the kApp
and Keycloak are functional.

````
$ npx mocha keycloak_create_new_user.js
````

This fourth test creates a new user in Keycloak,
and checks, via the kApp‘s API, that the user count
has increased by 1. That means the communication
between the Keycloak listener and the Feathers
endpoint is functional.


During the test,
a `cache.json` file is stored locally, to pass
information to the next pass. It contains
the data randomly generated used during the tests.

Example of such a `cache.json` file:

````
{
    "newUsername":"petitponeyllhnu4lya8",
    "newEmail":"petitponeyllhnu4lya8@gmail.com",
    "newPasswordInKeycloak":"tutu",
    "newPasswordInKApp":"petitponeyllhnu4lya8-Pass;word1",
    "clientSecret":"dWyLFdRH06NqhVkoN8lNLU5fHw2rZ39l"
}
````

Continue to run the tests:

````
$ npx mocha kApp_login_with_new_user_through_keycloak.js
````

This fifth test logs in the kApp through Keycloak.
This is not a big deal, since the user was created
in Keycloak.


````
$ npx mocha kApp_login_with_new_user.js
````

This sixth test is more interesting: It logs
in the kApp directly with the new user (and a
password different than the one in Keycloak.)
This ensures that the user has been created in
the kApp’s database through the Feathers service.


For now you must find a _second_ access token that
will be used to run the “delete user” test.

````
$ export KAPP_ACCESS_TOKEN2=<your access token>
$ npx mocha keycloak_delete_user_previously_created.js
````

This seventh test deletes in Keycloak
the user previously created, and checks via
the kApp’s API that the user count has been
decreased by 1.


> Here is a way to get this second access token for the kApp:
> 
> ````
> curl --location 'http://localhost:8082/api/authentication' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "strategy": "local",
         "email": "petitponeyllhnu4lya8@gmail.com",
         "password": "petitponeyllhnu4lya8-Pass;word1"
     }'
> ````
> 
> Those are the values from `cache.json`.


At this point everything should be fine.

If you want to delete the “Kalisio” realm 
in Keycloak via the command line, run:

````
$ npx mocha keycloak_tearDown.js
````

This eighth test logs in the Keycloak GUI
and deletes the “Kalisio” realm.




## Test results: screenshots

Screenshots are taken during the tests
and saved in the `test/screenshots`
directory.

Examples can be seen here:
[feathers-keycloak-listener-screenshots](https://gitlab.com/avcompris/kalisio/feathers-keycloak-listener-screenshots/)


## Continuous Integration — CI

As for now, autonomous
tests are run in a GitLab CI
environment.

See the [`.gitlab-ci.yml`](../.gitlab-ci.yml) configuration.





-- 

_[Back to the home page](../README.md)
— Previous page: [5. How to deploy locally](Deploy.md)
— Next page: [7. Troubleshooting](Troubleshooting.md)_

