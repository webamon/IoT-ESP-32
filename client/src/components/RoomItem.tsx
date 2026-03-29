import { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import RouterIcon from '@mui/icons-material/Router'
import SettingsIcon from '@mui/icons-material/Settings'

interface Room {
  id: string
  label: string
}

interface Props {
  macAddress: string
  rooms?: Room[]
  onAssign?: (macAddress: string, roomId: string) => void
}

export function RoomItem({ macAddress, rooms = [], onAssign }: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const [selectedRoom, setSelectedRoom] = useState('')

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Chip icon={<RouterIcon />} label={macAddress} variant="outlined" />
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <SettingsIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {rooms.length > 0 && (
          <Box
            sx={{
              px: 2,
              py: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Assigner à une pièce
            </Typography>
            <Select
              size="small"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              displayEmpty
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="" disabled>
                Choisir…
              </MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.label}
                </MenuItem>
              ))}
            </Select>
            <Button
              size="small"
              variant="contained"
              disabled={!selectedRoom}
              onClick={() => {
                setAnchor(null)
                onAssign?.(macAddress, selectedRoom)
                setSelectedRoom('')
              }}
            >
              Valider
            </Button>
          </Box>
        )}
      </Menu>
    </Box>
  )
}
