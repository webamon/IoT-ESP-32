/* External */
import '@fastify/jwt'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'

/* Internal */
import { createUser, getUserByEmail } from '../persistence/db.js'

/* Domain */
import type { User } from '../domain/user.js'
import {
  AuthenticationError,
  UserAlreadyExistsError,
  UserCreationError,
} from '../domain/errors.js'

export async function userLogin(
  email: string,
  password: string,
  fastify: FastifyInstance
): Promise<string> {
  const user = await getUserByEmail(email)

  const isValid = user ? await bcrypt.compare(password, user.password) : false
  if (!user || !isValid) throw new AuthenticationError()

  return fastify.jwt.sign(
    { id: user.id, email: user.email },
    { expiresIn: '7d' }
  )
}

export async function userRegister(
  email: string,
  password: string,
  fastify: FastifyInstance
): Promise<string> {
  const user = await getUserByEmail(email)

  if (user) throw new UserAlreadyExistsError(email)

  const passwordHash = await bcrypt.hash(password, 10)
  const userCreated = await createUser(email, passwordHash)

  if (!userCreated) {
    throw new UserCreationError()
  }
  return fastify.jwt.sign(
    { id: userCreated.id, email: userCreated.email },
    { expiresIn: '7d' }
  )
}
