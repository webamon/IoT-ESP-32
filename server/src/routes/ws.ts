/* External */
import type { FastifyInstance } from 'fastify'

/* Internal */
import { addWSClient } from '../transport/ws.js'

export async function wsRoutes(fastify: FastifyInstance) {
  fastify.get('/sensor-measures', { websocket: true }, (socket) => {
    addWSClient(socket)
  })
}
