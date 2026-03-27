import { Box, Chip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RouterIcon from '@mui/icons-material/Router'

interface Props {
  userId: string
}

async function fetchRoomDevices(roomId: string) {
  const response = await fetch(`http://localhost:3000/rooms/${roomId}/devices`)
  return response.json()
}

export function RoomDetailPage({ userId }: Props) {
  const { roomId } = useParams<{ roomId: string }>()
  const [devices, setDevices] = useState<{ mac_address: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (roomId) {
        const data = await fetchRoomDevices(roomId)
        setDevices(data)
      }
    }

    fetchData()
  }, [roomId])

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
