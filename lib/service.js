import _ from 'lodash'
import path from 'path'
import { BadRequest } from '@feathersjs/errors'

export default class KeycloakListenerService {

  constructor (options) {
    // check params
    if (!options) throw new Error('constructor: \'options\' param must be provided')
    // setup app
    if (!options.app) throw new Error('constructor: \'options.app\' param must be provided')
    this.app = options.app
  }

  async create (data, params) {

    if (!data.eventClass) throw new BadRequest('create: missing \'data.eventClass\'')

    console.log('KeycloakListenerService.create: data: %s', JSON.stringify(data))

    const service = this;

    const eventClass = data.eventClass // 'AdminEvent' | 'Event'

    if (eventClass === 'AdminEvent') {

        const operationType = data.operationType // e.g. 'CREATE'
        const resourceType = data.resourceType // e.g. 'USER'
        const key = eventClass + '.' + operationType + '.' + resourceType

        switch (key) {
        case 'AdminEvent.CREATE.USER':
            service.createUser(data)
            break;
        case 'AdminEvent.UPDATE.USER':
            service.updateUser(data)
            break;
        case 'AdminEvent.DELETE.USER':
            service.deleteUser(data)
            break;
        default:
            break;
        }

    } else {

        const type = data.type // e.g. 'LOGIN'
        const key = eventClass + '.' + type

        switch (key) {
        case 'Event.LOGIN':
            service.userLogin(data)
            break;
        case 'Event.LOGOUT':
            service.userLogout(data)
            break;
        default:
            break;
        }
    }

    return { success: true }
  }

  async createUser (data) {

  }

  async updateUser (data) {

  }

  async deleteUser (data) {

  }

  async userLogin (data) {

  }

  async userLogout (data) {

  }
}
