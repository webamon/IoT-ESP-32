import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

interface Props {
  userId: string
}

export function RoomDetailPage({ userId }: Props) {
  const { roomName } = useParams<{ roomName: string }>()

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">{roomName}</Typography>
    </Box>
  )
}
