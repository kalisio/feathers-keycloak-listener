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
    triggers: [{
      eventClass: 'AdminEvent',
      operationType: 'CREATE',
      resourceType: 'USER',
      action: (event) => {
        if (event.representation.email) {
          console.log('Creating user: ' + event.representation.email + ' (' + event.representation.username + ')')
          app.getService('users').create({ 
            email: event.representation.email,
            password: event.representation.username + '-Pass;word1',
            name: event.representation.username
          })
        } else {
          console.log('Cannot create user with no email: ' + event.representation.username)
        }
      }
    }, {
      eventClass: 'AdminEvent',
      operationType: 'UPDATE',
      resourceType: 'USER',
      action: (event) => {
        if (event.representation.email) {
          usersService.find({ query: { email: event.representation.email } }).then((response) => {
            if (response.total === 0) {
              console.log('Creating user: ' + event.representation.email + ' (' + event.representation.username + ')')
              app.getService('users').create({ 
                email: event.representation.email,
                password: event.representation.username + '-Pass;word1',
                name: event.representation.username
              })
            } else {
              console.log('User already exists: ' + event.representation.email)
            }
          })
        }
      }
    }]
  }))
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