import type { FastifyInstance } from 'fastify'
import { addWSClient } from '../transport/ws.js'

export async function wsRoutes(fastify: FastifyInstance) {
  fastify.get('/sensor-measures', { websocket: true }, (socket) => {
    addWSClient(socket)
  })
}
