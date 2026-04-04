import mqtt from 'mqtt'
import { handleSensorData } from '../services/sensor-service.js'
import { broadcastWS } from './ws.js'

export function startMqttListener(deviceId?: string): void {
  const client = mqtt.connect('mqtt://mosquitto:1883')
  const topic = deviceId ? `maison/+/${deviceId}` : 'maison/+/+'

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
