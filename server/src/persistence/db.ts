/* External */
import pg from 'pg'

/* Internal */
import { config } from '../config.js'

/* Domain */
import type { Room } from '../domain/room.js'
import type { Device, DeviceRoom } from '../domain/device.js'
import { User } from '../domain/user.js'

const pool = new pg.Pool(config.db)

interface MeasureRow {
  sensor_id: string
  metric: string
  value: number
  time: Date
}

export async function saveMeasure(
  sensorId: string,
  metric: string,
  value: number
): Promise<Date> {
  const result = await pool.query<{ time: Date }>(
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
): Promise<MeasureRow[]> {
  const result = await pool.query<MeasureRow>(
    `SELECT sensor_id, metric, value, time
   FROM sensor_readings
   WHERE sensor_id = $1 AND metric = $2 AND time >= $3 AND time <= $4`,
    [deviceId, metric, from, to]
  )

  return result.rows
}

export async function getUserRooms(userId: string): Promise<Room[]> {
  const result = await pool.query<Room>(
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
): Promise<Room> {
  const result = await pool.query<Room>(
    `INSERT INTO rooms (user_id, label) VALUES ($1, $2) RETURNING id, label`,
    [userId, label]
  )

  return result.rows[0]
}

export async function getDevicesByRoom(roomId: string): Promise<Device[]> {
  const result = await pool.query<Device>(
    `SELECT mac_address
   FROM devices
   WHERE room_id = $1`,
    [roomId]
  )
  return result.rows
}

export async function updateDeviceRoom(
  macAddress: string,
  roomId: string
): Promise<DeviceRoom> {
  const result = await pool.query<DeviceRoom>(
    `UPDATE devices SET room_id = $1 WHERE mac_address = $2 RETURNING mac_address, room_id`,
    [roomId, macAddress]
  )

  return result.rows[0]
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    `SELECT id, email, password_hash as password FROM users WHERE email= $1`,
    [email]
  )

  return result.rows[0] ?? null
}

export async function createUser(
  email: string,
  passwordHash: string
): Promise<User | null> {
  const result = await pool.query<User>(
    `INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING id, email, password_hash as password`,
    [email, passwordHash]
  )

  return result.rows[0] ?? null
}
