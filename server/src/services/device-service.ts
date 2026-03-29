import { updateDeviceRoom as dbUpdateDeviceRoom } from '../persistence/db.js'

export async function updateDeviceRoom(macAddress: string, roomId: string) {
  return await dbUpdateDeviceRoom(macAddress, roomId)
}
