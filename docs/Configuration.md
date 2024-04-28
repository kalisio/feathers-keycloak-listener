
_[Back to the home page](../README.md)
— Previous page: [3. About Business Logic](./Business_Logic.md)
— Next page: [5. How to deploy locally](./Deploy.md)_



--

# 4. Configuration

## Endpoint and access token

Your application will define the 
endpoint to send the JSON to:

````
app.use('/api/keycloak-events', new KeycloakListenerService({
	app: app
}), {
   methods: [
     'create',
     'createUser',
     'updateUser',
     'deleteUser'
   ]
});
````

Here with an example of a `POST /api/keycloak-events`
endpoint.

In Keycloak, you will have to configure this
endpoint, along with an access token, in the
[keycloak-event-gateway](https://github.com/kalisio/keycloak-event-gateway) plugin.

Make sure the access token’s lifecycle is
at least as long as your Keycloak’s instance is up.

## Hooks

In your code you will define hooks around the 
`KeycloakListenerService`
methods you want to implement.

Example:



````
app.getService('keycloak-events').hooks({
   before: {
      createUser: [
        async (context) => {
          const event = context.arguments[0];
          
          ...
          
          // Use the event: Acccess to 
          // event.operationType, event.resourcePath, 
          // etc.
          //
          // See some examples of JSON payloads
          // in project keycloak-event-gateway
        },
      ],
   }
});
````


## Full example

In this project, see the 
[`services.js`](../test/resources/kApp/api/src/services.js)
file,
from Kalisio’s [kApp](https://kalisio.github.io/kApp/),
given as an example.




-- 


_[Back to the home page](../README.md)
— Previous page: [3. About Business Logic](./Business_Logic.md)
— Next page: [5. How to deploy locally](./Deploy.md)_
