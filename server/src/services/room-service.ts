import { addUserRoom } from '../persistence/db.js'

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
