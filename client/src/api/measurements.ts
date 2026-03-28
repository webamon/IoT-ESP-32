import { BASE_URL } from './config'

export async function getMeasurements(metric: string, from: string, to: string) {
  const res = await fetch(
    `${BASE_URL}/measurements?deviceId=A1B2C3D4E5F6&metric=${metric}&from=${from}&to=${to}`
  )
  return res.json()
}
