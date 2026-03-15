import pg from 'pg'

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'iot_db',
  user: 'root',
  password: 'iot',
})

export async function saveMeasure(sensorId: string, metric: string, value: number): Promise<Date>  {
  const result = await pool.query(
    `INSERT INTO sensor_readings (sensor_id, metric, value)
     VALUES ($1, $2, $3) RETURNING time`,
    [sensorId, metric, value]
  )

  return result.rows[0].time
}