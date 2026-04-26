import { Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { type Dayjs } from 'dayjs'
import { getMeasurements } from '../api/measurements'
import { SensorGraphic } from './SensorGraphic'
import type { SensorData } from '../../../server/src/services/sensor-service'

interface Props {
  macAddress: string
  from: Dayjs
  to: Dayjs
  liveData: SensorData[]
}

export function DeviceGraphs({ macAddress, from, to, liveData }: Props) {
  const fromStr = from.format('YYYY-MM-DD')
  const toStr = to.endOf('day').toISOString()

  const { data: temperatures = [] } = useQuery<SensorData[]>({
    queryKey: ['measurements', macAddress, 'temperature', fromStr, toStr],
    queryFn: () => getMeasurements(macAddress, 'temperature', fromStr, toStr),
  })

  const { data: humidity = [] } = useQuery<SensorData[]>({
    queryKey: ['measurements', macAddress, 'humidity', fromStr, toStr],
    queryFn: () => getMeasurements(macAddress, 'humidity', fromStr, toStr),
  })

  const liveTemps = liveData.filter(
    (d) => d.deviceId === macAddress && d.metric === 'temperature'
  )
  const liveHumidity = liveData.filter(
    (d) => d.deviceId === macAddress && d.metric === 'humidity'
  )
  return (
    <Stack spacing={2}>
      <SensorGraphic
        data={[...temperatures, ...liveTemps]}
        metric="temperature"
      />
      <SensorGraphic data={[...humidity, ...liveHumidity]} metric="humidity" />
    </Stack>
  )
}
