/* Internal */
import {
  addUserRoom as dbAddUserRoom,
  getDevicesByRoom as dbGetDevicesByRoom,
  getUserRooms as dbGetUserRooms,
} from '../persistence/db.js'

/* Domain */
import type { Room } from '../domain/room.js'
import type { Device } from '../domain/device.js'

export class RoomLabelConflictError extends Error {}

export async function getRoomsForUser(userId: string) {
  return await dbGetUserRooms(userId)
}

export async function createRoom(userId: string, label: string): Promise<Room> {
  try {
    return await dbAddUserRoom(userId, label)
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      throw new RoomLabelConflictError(`Label "${label}" already exists`)
    }
    throw err
  }
}

function isPgUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === '23505'
  )
}

export async function getDevicesByRoomId(roomId: string): Promise<Device[]> {
  return dbGetDevicesByRoom(roomId)
}
