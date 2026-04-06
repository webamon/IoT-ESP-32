import { saveMeasure } from '../persistence/db.js'
import type { SensorData } from '../domain/sensor.js'

export type { SensorData }

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

export function convertDbEntryInSensorData(
  sensor_id: string,
  metric: string,
  value: number,
  time: Date
): SensorData {
  return { deviceId: sensor_id, metric, value, time }
}
