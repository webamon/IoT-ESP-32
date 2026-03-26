import { Box, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { UserRooms } from '../components/UserRooms'

interface Props {
  userId: string
}

export function RoomsPage({ userId }: Props) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Pièces</Typography>
      <UserRooms userId={userId} />
      <Outlet />
    </Box>
  )
}
