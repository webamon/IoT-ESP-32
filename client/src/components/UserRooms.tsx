import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  userId: string
}

async function fetchRooms(userId: string) {
  const response = await fetch(`http://localhost:3000/rooms?userId=${userId}`)
  return response.json()
}

export function UserRooms({ userId }: Props) {
  const [rooms, setRooms] = useState<{ id: string; label: string }[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await fetchRooms(userId)
      setRooms(rooms)
    }

    fetchData()
  }, [userId])

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {rooms.map((room) => (
        <Card
          key={room.id}
          onClick={() => navigate(`/rooms/${encodeURIComponent(room.label)}`)}
          sx={{
            minWidth: 140,
            cursor: 'pointer',
            borderRadius: 3,
            border: '1px solid',
            borderColor: location.pathname === `/rooms/${encodeURIComponent(room.label)}` ? 'primary.main' : 'transparent',
            boxShadow: location.pathname === `/rooms/${encodeURIComponent(room.label)}` ? '0 0 10px 2px rgba(25, 118, 210, 0.5)' : undefined,
            transition: 'box-shadow 0.2s, border-color 0.2s',
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <MeetingRoomIcon color="primary" />
            <Typography variant="subtitle1">{room.label}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
