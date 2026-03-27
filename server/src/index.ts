import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import { addWSClient } from './transport/ws.js'
import { startMqttListener } from './transport/mqtt.js'
import { getMeasures, getUserRooms } from './persistence/db.js'
import { convertDbEntryInSensorData } from './services/sensor-service.js'
import { createRoom, RoomLabelConflictError } from './services/room-service.js'

const fastify = Fastify({ logger: true })
await fastify.register(cors)
await fastify.register(websocket)

fastify.register(async (fastify) => {
  fastify.get<{
    Querystring: { deviceId: string; metric: string; from: Date; to: Date }
  }>('/measurements', async (request) => {
    const { deviceId, metric, from, to } = request.query
    const results = await getMeasures(deviceId, metric, from, to)

    return results.map(({ sensor_id, metric, value, time }) =>
      convertDbEntryInSensorData(sensor_id, metric, value, time)
    )
  })

  fastify.get<{
    Querystring: { userId: string }
  }>('/rooms', async (request) => {
    const { userId } = request.query
    const results = await getUserRooms(userId)

    return results
  })
  fastify.post('/rooms', async (request, reply) => {
    const { userId, label } = request.body
    try {
      return await createRoom(userId, label)
    } catch (err) {
      if (err instanceof RoomLabelConflictError) {
        return reply.status(409).send({ error: err.message })
      }
      throw err
    }
  })

  fastify.get('/sensor-measures', { websocket: true }, (socket) => {
    addWSClient(socket)
  })
})

startMqttListener()
await fastify.listen({ port: 3000, host: '0.0.0.0' })
