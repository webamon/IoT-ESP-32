import { BASE_URL } from './config'
import { apiFetch } from './fetch'

export async function updateDeviceRoom(macAddress: string, roomId: string) {
  const res = await apiFetch(`${BASE_URL}/devices/${macAddress}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId }),
  })
  return res.json()
}
