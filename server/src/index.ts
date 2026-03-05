import Fastify from 'fastify'
import mqtt, { MqttClient } from 'mqtt'

const fastify = Fastify({ logger: true })

interface SensorPayload {
  value: number
  unit: string
  timestamp: string
}

const mqttClient: MqttClient = mqtt.connect('mqtt://localhost:1883')

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT')
  mqttClient.subscribe('maison/salon/#')
})

mqttClient.on('message', (topic: string, message: Buffer) => {
  const payload: SensorPayload = JSON.parse(message.toString())
  console.log(`📨 [${topic}]`, payload)
})

await fastify.listen({ port: 3000 })