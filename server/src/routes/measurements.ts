import type { FastifyInstance } from 'fastify'
import { getMeasures } from '../persistence/db.js'
import { convertDbEntryInSensorData } from '../services/sensor-service.js'

export async function measurementsRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: { deviceId: string; metric: string; from: Date; to: Date }
  }>('/measurements', async (request) => {
    const { deviceId, metric, from, to } = request.query
    const results = await getMeasures(deviceId, metric, from, to)

    return results.map(({ sensor_id, metric, value, time }) =>
      convertDbEntryInSensorData(sensor_id, metric, value, time)
    )
  })
}
