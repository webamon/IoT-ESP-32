import { Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

interface Props {
  userId: string
}

export function RoomDetailPage({ userId }: Props) {
  const { roomName } = useParams<{ roomName: string }>()

  return <Typography variant="h1">{roomName}</Typography>
}
