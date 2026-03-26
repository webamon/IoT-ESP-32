import { LineChart } from '@mui/x-charts/LineChart'
import type { SensorData } from '../../../server/src/services/sensor-service'

interface Props {
  data: SensorData[]
}

export function SensorTemperature({ data }: Props) {
  return (
    <LineChart
      width={600}
      height={371}
      series={[
        { data: data.map((d) => d.value), label: 'Température', color: 'red' },
      ]}
      xAxis={[
        {
          data: data.map((d) => d.time),
          scaleType: 'point',
          label: 'Temps',
          tickInterval: (_, index) => index % 5 === 0,
          valueFormatter: (v) =>
            new Date(v).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
            }),
        },
      ]}
    />
  )
}
