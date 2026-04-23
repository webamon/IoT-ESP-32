import { BASE_URL } from './config'
import { apiFetch } from './fetch'

export async function logUser(email: string, password: string): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const { message } = await res.json()
    throw new Error(message)
  }
}
