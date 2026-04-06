import mqtt from 'mqtt'
import { handleSensorData } from '../services/sensor-service.js'
import { broadcastWS } from './ws.js'
import { config } from '../config.js'

export function startMqttListener(deviceId?: string): void {
  const client = mqtt.connect(config.mqtt.url)
  const prefix = config.mqtt.topicPrefix
  const topic = deviceId ? `${prefix}/+/${deviceId}` : `${prefix}/+/+`

  client.on('connect', () => {
    console.log('✅ Connecté au broker MQTT')
    client.subscribe(topic)
  })

  client.on('message', async (topic, message) => {
    const [home, room, deviceId] = topic.split('/')

    const { measures } = JSON.parse(message.toString())
    const sensorData = await handleSensorData(deviceId, measures)
    broadcastWS({ type: 'sensor:data', payload: sensorData })
  })
}
