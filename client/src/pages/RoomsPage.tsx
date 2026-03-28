import { Box, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { UserRooms } from '../components/UserRooms'
import { UserRoomForm } from '../components/UserRoomForm'

interface Props {
  userId: string
}

export function RoomsPage({ userId }: Props) {
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5">Pièces</Typography>
      <UserRoomForm userId={userId} />
      <UserRooms userId={userId} />
      <Outlet />
    </Box>
  )
}
