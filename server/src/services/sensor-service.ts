import { saveMeasure } from '../persistence/db.js'

export interface SensorData {
  deviceId: string
  metric: string
  value: number
  time: Date
}

export async function handleSensorData(
  deviceId: string,
  measures: Record<string, number>
): Promise<SensorData[]> {
  return Promise.all(
    Object.entries(measures).map(async ([metric, value]) => {
      const time = await saveMeasure(deviceId, metric, value)
      return { deviceId, metric, value, time }
    })
  )
}
