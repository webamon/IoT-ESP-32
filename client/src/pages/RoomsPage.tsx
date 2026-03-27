import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { UserRooms } from '../components/UserRooms'
import { UserRoomForm } from '../components/UserRoomForm'
import { useCallback } from 'react'

interface Props {
  userId: string
}

export function RoomsPage({ userId }: Props) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRoomAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5">Pièces</Typography>
      <UserRoomForm userId={userId} onRoomAdded={handleRoomAdded} />
      <UserRooms userId={userId} refreshKey={refreshKey} />
      <Outlet />
    </Box>
  )
}
