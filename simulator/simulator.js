import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  setInterval(() => {
    const payload = JSON.stringify({
      measures: {
        temperature: parseFloat((18 + Math.random() * 10).toFixed(2)),
        humidity: parseFloat((40 + Math.random() * 30).toFixed(2)),
      },
    })

    client.publish('maison/salon/A1B2C3D4E5F6', payload)
    console.log('📤 Message publié :', payload)
  }, 1000)
})
