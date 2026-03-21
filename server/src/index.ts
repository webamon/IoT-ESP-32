import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import { addWSClient } from './transport/ws.js'
import { startMqttListener } from './transport/mqtt.js'

const fastify = Fastify({ logger: true })
await fastify.register(websocket)

fastify.register(async (fastify) => {
  fastify.get('/sensor-measures', { websocket: true }, (socket) => {
    addWSClient(socket)
  })
})

startMqttListener()
await fastify.listen({ port: 3000, host: '0.0.0.0' })
