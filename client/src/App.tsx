import { useEffect, useState } from 'react'
import { Legend, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { SensorData } from '../../server/src/services/sensor-service'

import './App.css'

const WS_URI = 'ws://localhost:3000/sensor-measures'

function App() {
  const [temperatures, setTemperatures] = useState<SensorData[]>([])
  const [humidity, setHumidity] = useState<SensorData[]>([])

  useEffect(() => {
    const ws = new WebSocket(WS_URI)

    ws.addEventListener('message', (e) => {
      const sensorDatas: Array<SensorData> = JSON.parse(e.data)

      sensorDatas.map((sensorData) => {
        if (sensorData.metric === 'temperature') {
          setTemperatures((prev) => [...prev, { ...sensorData }])
        }

        if (sensorData.metric === 'humidity') {
          setHumidity((prev) => [...prev, { ...sensorData }])
        }
      })
    })

    return () => ws.close()
  }, [])

  console.log(temperatures, humidity)
  return (
    <>
      <div>Hellow World</div>

      <LineChart
        style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
        responsive
        data={temperatures}
      >
        <Line dataKey="value" />
        <XAxis dataKey="time" />
        <YAxis dataKey="value" />
        <Legend />
      </LineChart>
      <LineChart
        style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
        responsive
        data={humidity}
      >
        <Line dataKey="value" />
        <XAxis dataKey="time" />
        <YAxis dataKey="value" />
        <Legend />
      </LineChart>
    </>
  )
}

export default App
