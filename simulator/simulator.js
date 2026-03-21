import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  const payload = JSON.stringify({
    measures: { temperature: 23.4, humidity: 65 },
  })

  client.publish('maison/salon/device1', payload)
  console.log('📤 Message publié :', payload)
  client.end()
})
