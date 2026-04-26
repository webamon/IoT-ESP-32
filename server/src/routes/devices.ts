/* External */
import type { FastifyInstance } from 'fastify'

/* Internal */
import {
  updateDeviceRoom,
  getUnassignedDevices,
} from '../services/device-service.js'

export async function devicesRoutes(fastify: FastifyInstance) {
  fastify.get('/devices', async () => {
    return getUnassignedDevices()
  })

  fastify.patch<{
    Params: { macAddress: string }
    Body: { roomId: string | null }
  }>('/devices/:macAddress', async (request) => {
    const { macAddress } = request.params
    const { roomId } = request.body
    return updateDeviceRoom(macAddress, roomId)
  })
}
