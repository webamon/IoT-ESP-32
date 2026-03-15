import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import mqtt, { MqttClient } from 'mqtt'
import { WebSocket } from 'ws'
import {saveMeasure } from './db.ts'

const fastify = Fastify({ logger: true })
fastify.register(websocket)

const WSClients: WebSocket[] = []

interface SensorPayload {
  value: number
}

const mqttClient: MqttClient = mqtt.connect('mqtt://localhost:1883')

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT')
  mqttClient.subscribe('maison/salon/#')
})


// MQTT 
mqttClient.on('message', async(topic: string, message: Buffer) => {

  const [id_1,id_2,id_3,metric] = topic.split('/')

  const deviceId = `${id_1}_${id_2}_${id_3}`


  const payload: SensorPayload = JSON.parse(message.toString())
  const saveResult = await saveMeasure(deviceId, metric, payload.value)

  WSClients.forEach((WSClient)=> WSClient.send(JSON.stringify({value: payload.value, time:saveResult})))

})

// FASTIFY
fastify.register(async function (fastify) {
  fastify.get('/temperature', { websocket: true }, (socket, req ) => {
   //on veut avoir tout les clients connecté au WS dans une variable
    WSClients.push(socket)  
    //un client se deco du websocket on le dégage
    socket.on('close', () => {
      WSClients.splice(WSClients.indexOf(socket), 1)
    })
  })
})

await fastify.listen({ port: 3000 })