import { LineChart } from '@mui/x-charts/LineChart'
import type { SensorData } from '../../../server/src/services/sensor-service'

const metricConfig = {
  temperature: { label: 'Température', color: 'red' },
  humidity: { label: 'Humidité', color: 'blue' },
} as const

type Metric = keyof typeof metricConfig

interface Props {
  data: SensorData[]
  metric: Metric
}

export function SensorGraphic({ data, metric }: Props) {
  const { label, color } = metricConfig[metric]

  return (
    <LineChart
      width={600}
      height={371}
      series={[{ data: data.map((d) => d.value), label, color }]}
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
