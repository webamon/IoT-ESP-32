/* External */
import type { FastifyInstance } from 'fastify'

/* Internal */
import { userLogin, userRegister } from '../services/auth-service.js'
import {
  AuthenticationError,
  UserAlreadyExistsError,
} from '../domain/errors.js'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: { email: string; password: string }
  }>('/login', async (request, reply) => {
    const { email, password } = request.body

    try {
      const userJWT = await userLogin(email, password, fastify)
      return reply
        .setCookie('token', userJWT, {
          httpOnly: true, // inaccessible depuis JS (protection XSS)
          path: '/',
          sameSite: 'strict', // bloque l'envoi cross-site (protection CSRF)
          secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
        })

        .status(200)
        .send()
    } catch (err) {
      if (err instanceof AuthenticationError) {
        return reply
          .code(401)
          .send({ message: 'Email ou mot de passe invalide' })
      }
      return reply.status(500).send({ message: 'Internal error' })
    }
  })

  fastify.post<{
    Body: { email: string; password: string }
  }>('/register', async (request, reply) => {
    const { email, password } = request.body
    try {
      const userJWT = await userRegister(email, password, fastify)
      reply
        .setCookie('token', userJWT, {
          httpOnly: true, // inaccessible depuis JS (protection XSS)
          path: '/',
          sameSite: 'strict', // bloque l'envoi cross-site (protection CSRF)
          secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
        })

        .status(200)
        .send()
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        reply.status(409).send({ message: err.message })
      } else {
        reply.status(500).send({ message: 'Internal error' })
      }
    }
  })
}
