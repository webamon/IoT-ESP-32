import { useEffect, useState } from 'react'
import { Legend, Line, LineChart, XAxis, YAxis } from 'recharts';


import './App.css'

const WS_URI = 'ws://localhost:3000/temperature'

interface Temperature {
    value: number
    date: EpochTimeStamp
}

function App() {

  const [temperatures, setTemperatures] = useState<Temperature[]>([])

  useEffect(() => {
    const ws = new WebSocket(WS_URI)

    ws.addEventListener('message', (e) => {

      const {value, time}= JSON.parse(e.data)

      console.log()
      setTemperatures(prev => [...prev, {value:value,date:time}])
    })

    return () => ws.close()
  }, [])


  
  return (
  <>
    <div>Hellow World</div>
    {temperatures.length !==0 && <div>{temperatures[0].date}/{temperatures[0].value}</div> }
    <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={temperatures}>
        <Line dataKey="value" />
        <XAxis dataKey="date" />
        <YAxis dataKey="value" />
        <Legend />
    </LineChart>
  </>
  )
}

export default App
