_[Back to the home page](../README.md)
— Previous page: [2. API](./API.md)
— Next page: [4. Configuration](./Configuration.md)_


--

# 3. About Business Logic

When implementing a synchronization system
between
two user bases such as Keycloak’s and a
third-party application’s,
you should be aware of the use cases that may
occur and challenge your system.

For instance, a user may have been created in
Keycloak but for
whatever reason is non-existent in the
third-party application (triggers have had their
chance).

* What should happen, business-wise,
  if the user logs in the app
  through Keycloak?
* What should happen, business-wise,
  if the user is deleted from Keycloak?

Alternatively, a user may have been deleted from
Keycloak, but for whatever reason still exists
in the thid-party application’s database.

* What should happen, business-wise,
  if the user logs in the app
  and performs some actions?
* What should happen, business-wise,
  if the user is deleted from the application?
  
In all cases, you should take notice of two
possible behaviours that help implement your
business logic:

* Triggered actions — _What automated behaviours
  our system should implement?_
* Search for consistency — _On what criteria
  do we ensure that our two-database system
  is consistent business-wise?_

![xxx](x)

## Triggered actions

It’s common practice to rely on triggered actions
to imagine that, in the system,
“event A” will
automatically be followed by “event B”.

But in a non-transactional world, e.g. when using
asynchronous calls, well,
desynchronization happens.

And by definition, triggered actions cannot handle
those cases since those cases
are exceptions from the
desired behaviour where everything goes smoothly
trhough triggered actions.

## Search for consistency

This aspect is orthogonal to the triggered actions
principle, since:

1. The search for consistency occurs in a differed way;
2. It can grab the system as a whole, not at
   action- and/or at entity-level.

You need to list the sanity checks you would like
to perform regularly (ideally at once). For instance,
if your database uses the following attributes for
the User entity:

* `_id`
* `profile.name` (username)
* `email`

And Keycloak uses this:

* `id`
* `username`
* `email`

You should ask yourself what is the reference key
between the two?

* `email`? But what if a user updates their email in
  Keycloak? Do we lose our synchronization with the
  application?
* `username`? Same question.
* `_id` and `id`? Obviously you cannot have the two
  databases use the same ID mechanism.
  
But then, what if one of the two systems (say, Keycloak)
was seen as a _master_ and the other as a _slave_?
Namely, that means the User entries in the application
should hold a `keycloakId` field, referencing the
corresponding entry in Keycloak. This is actually
a good idea… if you can enforce that this `keycloakId`
will remain consistent.

## How to prevent the loss of consistency

In a perfect world, consistency is assured because
all triggered actions went well.

So we can think that if a loss of consistency is
detected, it is only a matter of auditing the
actions (or “commands”) sent to the system, and
see at what point the commands started to deviate
from the desired behaviour. Then if we re-run the
command in a fixed environment, consistency will
be met.

That means the _prevention_ of the loss of
consistency relies on the _perfect knowledge_
of all business actions (or “commands”) that
are sent to the system.

This is a higher level of logging in your
`app.log.1` log-rotate directory. This means
auditable business logs, with the ability to
replay a series of commands, which means the
logged commands are stored technically,
along with the full
amount of business data they were conveying.


![xxx](x)

## How to fix a loss of consistency


You will rely heavily on _common ids_.




![xxx](x)


--

_[Back to the home page](../README.md)
— Previous page: [2. API](./API.md)
— Next page: [4. Configuration](./Configuration.md)_

