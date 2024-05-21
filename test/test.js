import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import { MemoryService } from '@feathersjs/memory'
import superagent from 'superagent'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { Service , hooks } from '../lib/index.js'

import { AdminEvents, UserEvents } from './data/index.js'

let app, usersService, kcListenerService, expressServer

describe('feathers-keycloak-listener-service', () => {
  before(() => {
    chailint(chai, util)
    app = express(feathers())
    app.use(express.json())
    app.configure(express.rest())
  })
  it('is ES module compatible', () => {
    expect(typeof Service).to.equal('function')
  })
  it('create the services', async () => {
    // create the user service
    app.use('users', new MemoryService({ id: '_id', paginate: { default: 12, max: 50 }}))
    usersService = app.service('users')
    expect(usersService).toExist()
    // create the kcListenerService service
    app.use('kc-events', new Service(), { methods: ['create'] })
    kcListenerService = app.service('kc-events')
    expect(kcListenerService).toExist()
    // run the server
    expressServer = await app.listen(3333)
  })
  it('trigger create user without hook', async () => {
    let response = await superagent.post('http://localhost:3333/kc-events')
                                   .set('Content-Type', 'application/json')
                                   .send(AdminEvents.createUser)
    response = await usersService.find({})
    expect(response.data.length).to.equal(0)
  })
  it('install hooks', () => {
    kcListenerService.hooks({
      after: {
        create: [
          hooks.createUser,
          hooks.updateUser,
          hooks.deleteUser,
          hooks.setSession,
          hooks.unsetSession
        ]
      }
    })
    expect(typeof kcListenerService.hooks).to.equal('function')
  })
  it('trigger create user event', async () => {
    let response = await superagent.post('http://localhost:3333/kc-events')
                                   .set('Content-Type', 'application/json')
                                   .send(AdminEvents.createUser)
    response = await usersService.find({})
    expect(response.data.length).to.equal(1)
    const user = response.data[0]
    expect(user.username).to.equal(AdminEvents.createUser.value.username)
    expect(user.email).to.equal(AdminEvents.createUser.value.email)
    expect(user.firstName).to.equal(AdminEvents.createUser.value.firstName)
    expect(user.lastName).to.equal(AdminEvents.createUser.value.lastName)
  })
  it('trigger user login event', async () => {
    let response = await superagent.post('http://localhost:3333/kc-events')
                                   .set('Content-Type', 'application/json')
                                   .send(UserEvents.login)
    response = await usersService.find({})
    expect(response.data.length).to.equal(1)
    const user = response.data[0]
    expect(user.session).toExist()
  })
  it('trigger user logout event', async () => {
    let response = await superagent.post('http://localhost:3333/kc-events')
                                   .set('Content-Type', 'application/json')
                                   .send(UserEvents.logout)
    response = await usersService.find({})
    expect(response.data.length).to.equal(1)
    const user = response.data[0]
    expect(user.session).to.equal(null)
  })
  it('trigger update user event', async () => {
    let response = await superagent.post('http://localhost:3333/kc-events')
                                   .set('Content-Type', 'application/json')
                                   .send(AdminEvents.updateUser)
    response = await usersService.find({})
    expect(response.data.length).to.equal(1)
    const user = response.data[0]
    expect(user.lastName).to.equal(AdminEvents.updateUser.value.lastName)
  })
  after(async () => {
    await expressServer.close()
  })
  it('trigger delete user event', async () => {
    let response = await superagent.post('http://localhost:3333/kc-events')
                                   .set('Content-Type', 'application/json')
                                   .send(AdminEvents.deleteUser)
    response = await usersService.find({})
    expect(response.data.length).to.equal(0)
  })
  after(async () => {
    await expressServer.close()
  })
})
