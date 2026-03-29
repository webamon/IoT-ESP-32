import { BASE_URL } from './config'

export async function updateDeviceRoom(macAddress: string, roomId: string) {
  const res = await fetch(`${BASE_URL}/devices/${macAddress}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId }),
  })
  return res.json()
}
