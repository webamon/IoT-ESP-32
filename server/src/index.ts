import Fastify from 'fastify'
import mqtt, { MqttClient } from 'mqtt'
import {saveMeasure } from './db.ts'

const fastify = Fastify({ logger: true })

interface SensorPayload {
  value: number
}

const mqttClient: MqttClient = mqtt.connect('mqtt://localhost:1883')

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT')
  mqttClient.subscribe('maison/salon/#')
})

mqttClient.on('message', async(topic: string, message: Buffer) => {

  const [id_1,id_2,id_3,metric] = topic.split('/')

  const deviceId = `${id_1}_${id_2}_${id_3}`


  const payload: SensorPayload = JSON.parse(message.toString())
  await saveMeasure(deviceId, metric, payload.value)
})

await fastify.listen({ port: 3000 })