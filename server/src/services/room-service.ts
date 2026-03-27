import { addUserRoom, getDevicesByRoom } from '../persistence/db.js'

export class RoomLabelConflictError extends Error {}

export async function createRoom(userId: string, label: string) {
  try {
    return await addUserRoom(userId, label)
  } catch (err: any) {
    if (err.code === '23505') {
      // unique_violation PostgreSQL
      throw new RoomLabelConflictError(`Label "${label}" already exists`)
    }
    throw err
  }
}

export async function getDevicesByRoomId(room_id: string) {
  try {
    return await getDevicesByRoom(room_id)
  } catch (err: any) {}
}
