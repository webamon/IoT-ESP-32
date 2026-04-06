import type { FastifyInstance } from 'fastify'
import { updateDeviceRoom } from '../services/device-service.js'

export async function devicesRoutes(fastify: FastifyInstance) {
  fastify.patch<{
    Params: { macAddress: string }
    Body: { roomId: string }
  }>('/devices/:macAddress', async (request) => {
    const { macAddress } = request.params
    const { roomId } = request.body
    return updateDeviceRoom(macAddress, roomId)
  })
}
