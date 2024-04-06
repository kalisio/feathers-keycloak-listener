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
    // FIXME this.usersService = xxx
  }

  async create (data, params) {

    if (!data.eventClassType) throw new BadRequest('create: missing \'data.eventClassType\'')

    console.log('KeycloakListenerService.create: data: ' + JSON.stringify(data))

    return {success: true}
  }
}
