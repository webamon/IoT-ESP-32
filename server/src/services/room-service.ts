/* Internal */
import { addUserRoom, getDevicesByRoom } from '../persistence/db.js'

/* Domain */
import type { Room } from '../domain/room.js'
import type { Device } from '../domain/device.js'

export class RoomLabelConflictError extends Error {}

export async function createRoom(userId: string, label: string): Promise<Room> {
  try {
    return await addUserRoom(userId, label)
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      throw new RoomLabelConflictError(`Label "${label}" already exists`)
    }
    throw err
  }
}

export async function getDevicesByRoomId(roomId: string): Promise<Device[]> {
  return getDevicesByRoom(roomId)
}

function isPgUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === '23505'
}
