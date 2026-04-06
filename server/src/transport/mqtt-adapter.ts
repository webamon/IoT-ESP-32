import type { SensorPayload } from '../domain/sensor.js'

export function parseMqttMessage(topic: string, message: Buffer): SensorPayload {
  const [, , deviceId] = topic.split('/')
  const { measures } = JSON.parse(message.toString())
  return { deviceId, measures }
}
