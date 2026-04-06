import pg from 'pg'
import { config } from '../config.js'

const pool = new pg.Pool(config.db)

interface MeasureRow {
  sensor_id: string
  metric: string
  value: number
  time: Date
}

export interface Room {
  id: string
  label: string
}

export interface Device {
  mac_address: string
}

export interface DeviceRoom {
  mac_address: string
  room_id: string
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
