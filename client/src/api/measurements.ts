import { BASE_URL, DEFAULT_DEVICE_ID } from './config'

export async function getMeasurements(metric: string, from: string, to: string) {
  const res = await fetch(
    `${BASE_URL}/measurements?deviceId=${DEFAULT_DEVICE_ID}&metric=${metric}&from=${from}&to=${to}`
  )
  return res.json()
}
