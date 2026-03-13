import pg from 'pg'

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'iot_db',
  user: 'root',
  password: 'iot',
})

export async function saveMeasure(sensorId: string, metric: string, value: number) {
  await pool.query(
    `INSERT INTO sensor_readings (sensor_id, metric, value)
     VALUES ($1, $2, $3)`,
    [sensorId, metric, value]
  )
}