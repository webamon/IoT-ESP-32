import mqtt from 'mqtt'
import { handleSensorData } from '../services/sensor-service.js'
import { broadcastWS } from './ws.js'

export function startMqttListener(): void {
  const client = mqtt.connect('mqtt://mosquitto:1883')

  client.on('connect', () => {
    console.log('✅ Connecté au broker MQTT')
    client.subscribe('maison/salon/#')
  })

  client.on('message', async (topic, message) => {
    const [id_1, id_2, id_3, metric] = topic.split('/')
    const deviceId = `${id_1}_${id_2}_${id_3}`
    const { value } = JSON.parse(message.toString())
    const sensorData = await handleSensorData(deviceId, metric, value)
    broadcastWS(sensorData)
  })
}
