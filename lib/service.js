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
    this.triggers = options.triggers
  }

  async create (data, params) {

    if (!data.eventClass) throw new BadRequest('create: missing \'data.eventClass\'')

//    console.log('KeycloakListenerService.create: data:raw: ' + JSON.stringify(data))

    if (data.eventClass === 'AdminEvent') {
        // Keycloak embeds a JSON string for the "representation" field.
        // Here we parse it into an object.
        data.representation = JSON.parse(data.representation)
    }
    
    console.log('KeycloakListenerService.create: data: ' + JSON.stringify(data))

    this.triggers.forEach((trigger) => {
      
       if (trigger.eventClass === 'AdminEvent'
        && trigger.eventClass === data.eventClass
        && trigger.operationType === data.operationType
        && trigger.resourceType === data.resourceType) {

           trigger.action(data)
      }
    })

    return { success: true }
  }
}
