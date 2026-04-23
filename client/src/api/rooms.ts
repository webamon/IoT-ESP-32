import { BASE_URL } from './config'
import { apiFetch } from './fetch'

export async function getRooms(userId: string) {
  const res = await apiFetch(`${BASE_URL}/rooms?userId=${userId}`)
  return res.json()
}

export async function getRoomDevices(roomId: string) {
  const res = await apiFetch(`${BASE_URL}/rooms/${roomId}/devices`)
  return res.json()
}

export async function createRoom(userId: string, label: string) {
  const res = await apiFetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, label }),
  })
  if (res.status === 409) {
    const { error } = await res.json()
    throw new Error(error)
  }
  return res.json()
}
