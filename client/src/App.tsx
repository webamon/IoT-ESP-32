import { useEffect, useCallback, useState } from 'react'
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Stack,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import type { SensorData } from '../../server/src/services/sensor-service'
import { SensorTemperature } from './components/SensorTemperature'
import { SensorHumidity } from './components/SensorHumidity'
import { UserRooms } from './components/UserRooms'

const USER_ID = 'bdc9760f-0964-43c0-b0b8-7efe97210aae' // A remplacer par une vraie gestion d'authentification

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const WS_URI = 'ws://localhost:3000/sensor-measures'

async function fetchMetric(metric: string, from: string, to: string) {
  const response = await fetch(
    `http://localhost:3000/measurements?deviceId=A1B2C3D4E5F6&metric=${metric}&from=${from}&to=${to}`
  )
  return response.json()
}

function App() {
  const [temperatures, setTemperatures] = useState<SensorData[]>([])
  const [humidity, setHumidity] = useState<SensorData[]>([])
  const [from, setFrom] = useState<Dayjs>(dayjs().subtract(1, 'day'))
  const [to, setTo] = useState<Dayjs>(dayjs())

  //FETCH EN DB
  useEffect(() => {
    const fetchData = async () => {
      const fromStr = from.format('YYYY-MM-DD')
      const toStr = to.format('YYYY-MM-DD')

      const [temps, humid] = await Promise.all([
        fetchMetric('temperature', fromStr, toStr),
        fetchMetric('humidity', fromStr, toStr),
      ])

      setTemperatures(temps)
      setHumidity(humid)
    }

    fetchData()
  }, [from, to])

  // Filtre les messages venant des WS
  const handleMessage = useCallback(
    (sensorDatas: SensorData[]) => {
      sensorDatas.forEach((sensorData) => {
        const time = dayjs(sensorData.time)
        //Si pas dans la range from to on stock pas dans le state
        if (time.isBefore(from, 'day') || time.isAfter(to, 'day')) return

        if (sensorData.metric === 'temperature') {
          setTemperatures((prev) => [...prev, sensorData])
        }

        if (sensorData.metric === 'humidity') {
          setHumidity((prev) => [...prev, sensorData])
        }
      })
    },
    [from, to]
  )

  //CONNEXION WEBSOCKET
  useEffect(() => {
    const ws = new WebSocket(WS_URI)

    const onMessage = (e: MessageEvent) => {
      const sensorDatas: SensorData[] = JSON.parse(e.data)
      handleMessage(sensorDatas)
    }

    ws.addEventListener('message', onMessage)

    return () => {
      ws.removeEventListener('message', onMessage)
      ws.close()
    }
  }, [handleMessage])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserRooms userId={USER_ID} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <DatePicker
              label="Du"
              value={from}
              onChange={(v) => v && setFrom(v)}
              maxDate={to}
            />
            <DatePicker
              label="Au"
              value={to}
              onChange={(v) => v && setTo(v)}
              minDate={from}
            />
          </Stack>
          <SensorTemperature data={temperatures} />
          <SensorHumidity data={humidity} />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
