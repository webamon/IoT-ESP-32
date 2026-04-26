import { BASE_URL } from './config'
import { apiFetch } from './fetch'

export async function getMeasurements(
  deviceId: string,
  metric: string,
  from: string,
  to: string
) {
  const res = await apiFetch(
    `${BASE_URL}/measurements?deviceId=${deviceId}&metric=${metric}&from=${from}&to=${to}`
  )
  return res.json()
}
