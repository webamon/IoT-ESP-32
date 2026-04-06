import pg from 'pg'
import { config } from '../src/config.js'

const pool = new pg.Pool(config.db)

const DEVICES_ID = [
  'A1B2C3D4E5F6',
  'B2C3D4E5F6A1',
  'C3D4E5F6A1B2',
  'D4E5F6A1B2C3',
  'E5F6A1B2C3D4',
]
const DAYS = 4
const INTERVAL_MINUTES = 10

async function seed() {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - DAYS)

  const entries: { deviceId: string; time: Date; metric: string; value: number }[] = []

  for (const deviceId of DEVICES_ID) {
    // Offset de température propre à chaque device (±2°C)
    const tempOffset = (Math.random() - 0.5) * 4

    for (
      let t = new Date(start);
      t <= now;
      t = new Date(t.getTime() + INTERVAL_MINUTES * 60_000)
    ) {
      const hour = t.getHours()
      // Température : varie entre 18°C la nuit et 26°C l'après-midi
      const temp =
        18 + tempOffset + 8 * Math.sin(((hour - 6) * Math.PI) / 12) + (Math.random() - 0.5)
      // Humidité : varie entre 40% et 70%, inverse de la température
      const humidity =
        55 -
        15 * Math.sin(((hour - 6) * Math.PI) / 12) +
        (Math.random() - 0.5) * 3

      entries.push({ deviceId, time: new Date(t), metric: 'temperature', value: parseFloat(temp.toFixed(2)) })
      entries.push({ deviceId, time: new Date(t), metric: 'humidity', value: parseFloat(humidity.toFixed(2)) })
    }
  }

  for (const entry of entries) {
    await pool.query(
      `INSERT INTO sensor_readings (sensor_id, metric, value, time) VALUES ($1, $2, $3, $4)`,
      [entry.deviceId, entry.metric, entry.value, entry.time]
    )
  }

  console.log(
    `✓ ${entries.length} entrées insérées (${DEVICES_ID.length} devices, ${DAYS} jours, toutes les ${INTERVAL_MINUTES} min)`
  )
  await pool.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
