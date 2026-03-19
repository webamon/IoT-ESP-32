import { saveMeasure } from '../persistence/db.js'

interface SensorData {
  value: number,
  time: Date
}

export async function handleSensorData(deviceId: string, metric: string, value: number): Promise<SensorData> {
  const time = await saveMeasure(deviceId, metric, value)
  return ({ value, time })
}
