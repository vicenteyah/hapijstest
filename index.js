require('dotenv').config()
const Hapi = require('hapi')
const Blipp = require('blipp')
const routes = {}
routes.auth = require('./routes')

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost'
})

async function init () {
    await server.register({
        plugin: Blipp,
        options:{
            showAuth: true
        }
    })
  server.route(routes.auth)
  
  try {
    await server.start()
    console.log(`server up on :${server.info.uri}`)
  } catch {
    console.log(error)
    process.exit(1)
  }
}

init()
module.exports = server
