import pg, { QueryResult } from 'pg'

const pool = new pg.Pool({
  host: 'timescaledb',
  port: 5432,
  database: 'iot_db',
  user: 'root',
  password: 'iot',
})

export async function saveMeasure(
  sensorId: string,
  metric: string,
  value: number
): Promise<Date> {
  const result = await pool.query(
    `INSERT INTO sensor_readings (sensor_id, metric, value)
     VALUES ($1, $2, $3) RETURNING time`,
    [sensorId, metric, value]
  )

  return result.rows[0].time
}

export async function getMeasures(
  deviceId: string,
  metric: string,
  from: Date,
  to: Date
): Promise<any[]> {
  const result = await pool.query(
    `SELECT sensor_id, metric, value, time 
   FROM sensor_readings
   WHERE sensor_id = $1 AND metric = $2 AND time >= $3 AND time <= $4`,
    [deviceId, metric, from, to]
  )

  return result.rows
}

export async function getUserRooms(userId: string): Promise<any[]> {
  const result = await pool.query(
    `SELECT id, label 
   FROM rooms
   WHERE user_id = $1`,
    [userId]
  )

  return result.rows
}

export async function addUserRoom(
  userId: string,
  label: string
): Promise<any[]> {
  const result = await pool.query(
    `INSERT INTO rooms (user_id, label) VALUES ($1, $2) RETURNING id, label`,
    [userId, label]
  )

  return result.rows
}

export async function getDevicesByRoom(roomId: string): Promise<any[]> {
  const result = await pool.query(
    `SELECT mac_address 
   FROM devices
   WHERE room_id = $1`,
    [roomId]
  )
  return result.rows
}
