/* External */
import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'

/* Config */
import { config } from './config.js'

/* Internal */
import { startMqttListener } from './transport/mqtt.js'
import { measurementsRoutes } from './routes/measurements.js'
import { roomsRoutes } from './routes/rooms.js'
import { devicesRoutes } from './routes/devices.js'
import { authRoutes } from './routes/auth.js'
import { wsRoutes } from './routes/ws.js'
import { meRoutes } from './routes/me.js'

const fastify = Fastify({ logger: true })
await fastify.register(cors, {
  credentials: true,
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})
await fastify.register(websocket)
await fastify.register(cookie)
await fastify.register(jwt, {
  secret: config.auth.jwtSecret,
  cookie: { cookieName: 'token', signed: false },
})
/* API */
fastify.register(authRoutes)
fastify.register(async (protectedApp) => {
  /* middleware de securisation */
  protectedApp.register(meRoutes)

  protectedApp.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch {
      return reply.code(401).send({ message: 'Acces Interdit' })
    }
  })
  /* Verification des informations de l'utilisateur */

  protectedApp.register(measurementsRoutes)
  protectedApp.register(roomsRoutes)
  protectedApp.register(devicesRoutes)
  protectedApp.register(wsRoutes)
})

startMqttListener()
await fastify.listen({ port: config.server.port, host: config.server.host })
