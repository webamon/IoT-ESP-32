/* External */
import type { FastifyInstance } from 'fastify'
import { UserPayload } from '../domain/user.js'

export async function meRoutes(fastify: FastifyInstance) {
  fastify.get('/me', async (request, reply) => {
    const user: UserPayload = await request.jwtVerify()
    console.log(
      'User payload======================================================:',
      user
    )
    reply.code(200).send({ email: user.email, id: user.id })
  })
}
