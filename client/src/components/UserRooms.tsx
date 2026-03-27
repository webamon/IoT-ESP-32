import { useEffect, useState } from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  userId: string
  refreshKey: number
}

async function fetchRooms(userId: string) {
  const response = await fetch(`http://localhost:3000/rooms?userId=${userId}`)
  return response.json()
}

export function UserRooms({ userId, refreshKey }: Props) {
  const [rooms, setRooms] = useState<{ id: string; label: string }[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await fetchRooms(userId)
      setRooms(rooms)
    }

    fetchData()
  }, [userId, refreshKey])

  return (
    <Grid container spacing={2}>
      {rooms.map((room) => (
        <Grid key={room.id} size={{ xs: 6, sm: 4, md: 3 }}>
          <Card
            onClick={() => navigate(`/rooms/${room.id}`)}
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border: '1px solid',
              borderColor:
                location.pathname === `/rooms/${room.id}`
                  ? 'primary.main'
                  : 'transparent',
              boxShadow:
                location.pathname === `/rooms/${room.id}`
                  ? '0 0 10px 2px rgba(25, 118, 210, 0.5)'
                  : undefined,
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <MeetingRoomIcon color="primary" />
              <Typography
                variant="subtitle2"
                sx={{ textTransform: 'capitalize' }}
              >
                {room.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
