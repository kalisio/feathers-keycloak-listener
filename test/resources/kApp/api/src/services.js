import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import kdkCore from '@kalisio/kdk/core.api.js'
// Insert at the end of existing imports:
// >>>
import KeycloakListenerService from '@kalisio/feathers-keycloak-listener/lib/service.js'
// <<<

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default async function () {
  const app = this

  // Set up our plugin services
  try {
    const packageInfo = fs.readJsonSync(path.join(__dirname, '../../package.json'))
    app.use(app.get('apiPath') + '/capabilities', (req, res, next) => {
      const response = {
        name: 'kapp',
        domain: app.get('domain'),
        version: packageInfo.version,
        vapidPublicKey: app.get('push').vapidDetails.publicKey
      }
      if (process.env.BUILD_NUMBER) {
        response.buildNumber = process.env.BUILD_NUMBER
      }
      res.json(response)
    })

// Insert before the "await app.configure(kdkCore)" line:
// >>>
  app.use(app.get('apiPath') + '/keycloak-events', new KeycloakListenerService({
    app: app,
  }), {
    methods: ['create', 'createUser', 'updateUser', 'deleteUser']
  });

  app.getService('keycloak-events').hooks({
    before: {
      create: [
        async (context) => {
          // catch all
        },
      ],
      createUser: [
        async (context) => {
          const event = context.arguments[0];
          if (event.value.email) {
            // e.g. keycloakResourcePath: 'users/f3814113-a3ac-424a-b8e2-8dfba5e7b1b7'
            // e.g. keycloakId: 'f3814113-a3ac-424a-b8e2-8dfba5e7b1b7'
            const keycloakId = event.resourcePath.substr(6)
            console.log('Creating user: %s (%s)', event.value.email, event.value.username)
            app.getService('users').create({
              email: event.value.email,
              password: event.value.username + '-Pass;word1',
              name: event.value.username,
              keycloakId: keycloakId,
            })
          } else {
            console.log('Cannot create user with no email: %s', event.value.username)
          }
        },
      ],
      updateUser: [
        async (context) => {
          const event = context.arguments[0];
          if (event.value.email) {
            // e.g. keycloakResourcePath: 'users/f3814113-a3ac-424a-b8e2-8dfba5e7b1b7'
            // e.g. keycloakId: 'f3814113-a3ac-424a-b8e2-8dfba5e7b1b7'
            const keycloakId = event.resourcePath.substr(6)
            usersService.find({ query: { email: event.value.email } }).then((response) => {
              if (response.total === 0) {
                console.log('Creating user: %s (%s)', event.value.email, event.value.username)
                app.getService('users').create({
                  email: event.value.email,
                  password: event.value.username + '-Pass;word1',
                  name: event.value.username,
                  keycloakId: keycloakId,
                })
              } else {
                console.log('User already exists: %s', event.value.email)
                console.log('Updating user.keycloadId...')
                const user = response.data[0]
                user.keycloakId = keycloakId
                app.getService('users').patch(user)
              }
            })
          }
        },
      ],
      deleteUser: [
        async (context) => {
          const event = context.arguments[0];
          // e.g. keycloakResourcePath: 'users/f3814113-a3ac-424a-b8e2-8dfba5e7b1b7'
          // e.g. keycloakId: 'f3814113-a3ac-424a-b8e2-8dfba5e7b1b7'
          const keycloakId = event.resourcePath.substr(6)
          usersService.find({ query: { keycloakId: keycloakId } }).then((response) => {
            if (response.total === 0) {
              console.log('No user exists with keycloakId: %s', keycloakId)
            } else {
              const user = response.data[0]
              console.log('Deleting user: %s (%s)', user.email, user.profile.name)
              app.getService('users').remove(user._id)
            }
          })
        },
      ],
    },
  });
// <<<

    await app.configure(kdkCore)
  } catch (error) {
    app.logger.error(error.message)
  }

  // Create a service
  await app.createService('documents', {
    servicesPath: '',
    modelsPath: path.join(__dirname, 'models')
  })

  // Create the default user
  const usersService = app.getService('users')
  const defaultUsers = app.get('authentication').defaultUsers
  // Do not use exposed passwords on staging/prod environments
  if (defaultUsers && !process.env.NODE_APP_INSTANCE) {
    // Create default users if not already done
    const users = await usersService.find({ paginate: false })
    for (let i = 0; i < defaultUsers.length; i++) {
      const defaultUser = defaultUsers[i]
      const createdUser = _.find(users, user => user.email === defaultUser.email)
      if (!createdUser) {
        app.logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
        await usersService.create(defaultUser)
      }
    }
  }
}
