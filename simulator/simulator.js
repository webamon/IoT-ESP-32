import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  const payload = JSON.stringify({
    value: 23.4,
    unit: '°C',
    timestamp: new Date().toISOString()
  })

  client.publish('maison/salon/temperature', payload)
  console.log('📤 Message publié :', payload)
  client.end()
})