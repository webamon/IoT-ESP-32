import { Box, Chip, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import RouterIcon from '@mui/icons-material/Router'
import { getRoomDevices } from '../api/rooms'

interface Props {
  userId: string
}

export function RoomDetailPage({ userId: _userId }: Props) {
  const { roomId } = useParams<{ roomId: string }>()

  const { data: devices = [] } = useQuery<{ mac_address: string }[]>({
    queryKey: ['rooms', roomId, 'devices'],
    queryFn: () => getRoomDevices(roomId!),
    enabled: !!roomId,
  })

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
            <Chip
              key={device.mac_address}
              icon={<RouterIcon />}
              label={device.mac_address}
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
