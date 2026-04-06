import type { FastifyInstance } from 'fastify'
import { getUserRooms } from '../persistence/db.js'
import {
  createRoom,
  getDevicesByRoomId,
  RoomLabelConflictError,
} from '../services/room-service.js'
import { broadcastWS } from '../transport/ws.js'

export async function roomsRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: { userId: string }
  }>('/rooms', async (request) => {
    const { userId } = request.query
    return getUserRooms(userId)
  })

  fastify.post<{ Body: { userId: string; label: string } }>('/rooms', async (request, reply) => {
    const { userId, label } = request.body
    try {
      const room = await createRoom(userId, label)
      broadcastWS({ type: 'room:created', payload: true })
      return room
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
