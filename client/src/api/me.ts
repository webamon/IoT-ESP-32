import type { UserPayload } from '../../../server/src/domain/user'
import { BASE_URL } from './config'
import { apiFetch } from './fetch'

export async function me(): Promise<UserPayload> {
  const res = await apiFetch(`${BASE_URL}/me`)

  if (res.status === 401) {
    throw new Error('Non authentifié')
  }

  return res.json()
}
