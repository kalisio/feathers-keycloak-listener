_[Back to the home page](../README.md)
— Previous page: [7. Troubleshooting](./Troubleshooting.md)
— Next page: [9. FAQ](./FAQ.md)_

--

# 8. Known Issues


## kApp’s access token and permissions


In order to perform tests, you need an access token
to configure the Keycloak listener that will be
able to create users in the kApp, 
and also delete users.

As for now, user creation in the kApp doesn’t
require an access token — so any will do.

But user deletion is limited to one’s own access
token. That means no user can delete a user, except
itself.


--


_[Back to the home page](../README.md)
— Previous page: [8. Known Issues](./Known_Issues.md)_
