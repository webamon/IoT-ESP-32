import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getRoomDevices, getRooms } from '../api/rooms'
import { updateDeviceRoom } from '../api/devices'
import { RoomItem } from '../components/RoomItem'
import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  userId: string
}

export function RoomDetailPage({ userId }: Props) {
  const { roomId } = useParams<{ roomId: string }>()
  const queryClient = useQueryClient()

  const { data: devices = [] } = useQuery<{ mac_address: string }[]>({
    queryKey: ['rooms', roomId, 'devices'],
    queryFn: () => getRoomDevices(roomId!),
    enabled: !!roomId,
  })

  const { data: rooms = [] } = useQuery<{ id: string; label: string }[]>({
    queryKey: ['rooms', userId],
    queryFn: () => getRooms(userId),
    select: (data) => data.filter((room) => room.id !== roomId),
  })

  const mutation = useMutation({
    mutationFn: ({
      macAddress,
      targetRoomId,
    }: {
      macAddress: string
      targetRoomId: string
    }) => updateDeviceRoom(macAddress, targetRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })

  const handleAssign = useCallback(
    (macAddress: string, targetRoomId: string) => {
      console.log(macAddress, targetRoomId)
      mutation.mutate({ macAddress, targetRoomId })
    },
    [mutation]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Devices</Typography>
      {devices.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucun device dans cette pièce
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {devices.map((device) => (
            <RoomItem
              key={device.mac_address}
              macAddress={device.mac_address}
              rooms={rooms}
              onAssign={handleAssign}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
