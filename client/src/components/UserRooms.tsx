import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { useNavigate } from 'react-router-dom'

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
          sx={{ minWidth: 140, cursor: 'pointer' }}
          onClick={() => navigate(`/rooms/${encodeURIComponent(room.label)}`)}
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
