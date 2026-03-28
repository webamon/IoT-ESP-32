import { useEffect, useCallback, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import type { SensorData } from '../../../server/src/services/sensor-service'
import { SensorTemperature } from '../components/SensorTemperature'
import { SensorHumidity } from '../components/SensorHumidity'
import { getMeasurements } from '../api/measurements'
import { BASE_URL } from '../api/config'

const WS_URI = `${BASE_URL.replace('http', 'ws')}/sensor-measures`

export function DashboardPage() {
  const [temperatures, setTemperatures] = useState<SensorData[]>([])
  const [humidity, setHumidity] = useState<SensorData[]>([])
  const [from, setFrom] = useState<Dayjs>(dayjs().subtract(1, 'day'))
  const [to, setTo] = useState<Dayjs>(dayjs())

  useEffect(() => {
    const fetchData = async () => {
      const fromStr = from.format('YYYY-MM-DD')
      const toStr = to.format('YYYY-MM-DD')

      const [temps, humid] = await Promise.all([
        getMeasurements('temperature', fromStr, toStr),
        getMeasurements('humidity', fromStr, toStr),
      ])

      setTemperatures(temps)
      setHumidity(humid)
    }

    fetchData()
  }, [from, to])

  const handleMessage = useCallback(
    (sensorDatas: SensorData[]) => {
      sensorDatas.forEach((sensorData) => {
        const time = dayjs(sensorData.time)
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
  )
}
