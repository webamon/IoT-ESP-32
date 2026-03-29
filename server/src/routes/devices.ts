import type { FastifyInstance } from 'fastify'
import { updateDeviceRoom } from '../services/device-service.js'

export async function devicesRoutes(fastify: FastifyInstance) {
  fastify.patch('/devices/:macAddress', async (request, reply) => {
    const { macAddress } = request.params as { macAddress: string }
    const { roomId } = request.body as { roomId: string }
    try {
      return await updateDeviceRoom(macAddress, roomId)
    } catch (err) {
      throw err
    }
  })
}
