/* Internal */
import {
  updateDeviceRoom as dbUpdateDeviceRoom,
  getUnassignedDevices as dbGetUnassignedDevices,
  getDevicesById as dbGetDevicesById,
} from '../persistence/db.js'

export async function deviceExist(macAddress: string) {
  return (await dbGetDevicesById(macAddress)) ? true : false
}

export async function updateDeviceRoom(
  macAddress: string,
  roomId: string | null
) {
  return await dbUpdateDeviceRoom(macAddress, roomId)
}

export async function getUnassignedDevices() {
  return await dbGetUnassignedDevices()
}
