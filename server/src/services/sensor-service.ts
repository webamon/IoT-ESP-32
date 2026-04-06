/* Internal */
import { getMeasures, saveMeasure } from '../persistence/db.js'

/* Domain */
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

export async function getMeasuresByDeviceId(
  deviceId: string,
  metric: string,
  from: string,
  to: string
) {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  const results = await getMeasures(deviceId, metric, fromDate, toDate)

  return results.map(({ sensor_id, metric, value, time }) =>
    convertDbEntryInSensorData(sensor_id, metric, value, time)
  )
}
