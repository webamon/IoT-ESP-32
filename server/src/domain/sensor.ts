export interface SensorData {
  deviceId: string
  metric: string
  value: number
  time: Date
}

export interface SensorPayload {
  deviceId: string
  measures: Record<string, number>
}
