import { useEffect, useCallback, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import type { SensorData } from '../../../server/src/services/sensor-service'
import { SensorGraphic } from '../components/SensorGraphic'
import { getMeasurements } from '../api/measurements'
import { useWS } from '../contexts/WSProvider'

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

  const { subscribe } = useWS()

  useEffect(() => {
    return subscribe((e: MessageEvent) => {
      const { type, payload } = JSON.parse(e.data)
      if (type === 'sensor:data') handleMessage(payload as SensorData[])
    })
  }, [handleMessage, subscribe])

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
        <SensorGraphic data={temperatures} metric="temperature" />
        <SensorGraphic data={humidity} metric="humidity" />
      </Box>
    </LocalizationProvider>
  )
}
