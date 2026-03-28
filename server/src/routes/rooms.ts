import type { FastifyInstance } from 'fastify'
import { getUserRooms } from '../persistence/db.js'
import {
  createRoom,
  getDevicesByRoomId,
  RoomLabelConflictError,
} from '../services/room-service.js'

export async function roomsRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: { userId: string }
  }>('/rooms', async (request) => {
    const { userId } = request.query
    return getUserRooms(userId)
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

  fastify.get<{
    Params: { roomId: string }
  }>('/rooms/:roomId/devices', async (request) => {
    const { roomId } = request.params
    return getDevicesByRoomId(roomId)
  })
}
