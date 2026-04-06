import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import { startMqttListener } from './transport/mqtt.js'
import { measurementsRoutes } from './routes/measurements.js'
import { roomsRoutes } from './routes/rooms.js'
import { devicesRoutes } from './routes/devices.js'
import { wsRoutes } from './routes/ws.js'
import { config } from './config.js'

const fastify = Fastify({ logger: true })
await fastify.register(cors, {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})
await fastify.register(websocket)

/* API */
fastify.register(measurementsRoutes)
fastify.register(roomsRoutes)
fastify.register(devicesRoutes)
fastify.register(wsRoutes)

startMqttListener()
await fastify.listen({ port: config.server.port, host: config.server.host })
