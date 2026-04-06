/* External */
import type { FastifyInstance } from 'fastify'

/* Internal */
import { getMeasuresByDeviceId } from '../services/sensor-service.js'

export async function measurementsRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: { deviceId: string; metric: string; from: string; to: string }
  }>('/measurements', async (request) => {
    const { deviceId, metric, from, to } = request.query
    return await getMeasuresByDeviceId(deviceId, metric, from, to)
  })
}
