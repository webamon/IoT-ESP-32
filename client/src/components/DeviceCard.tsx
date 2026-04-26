import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
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
  isSelected: boolean
  onClick: () => void
  rooms: Room[]
  onMove: (macAddress: string, targetRoomId: string) => void
  onRemove: (macAddress: string) => void
}

export function DeviceCard({ macAddress, isSelected, onClick, rooms, onMove, onRemove }: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const [moveTarget, setMoveTarget] = useState('')

  const handleSettingsClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchor(e.currentTarget)
  }

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        boxShadow: isSelected ? '0 0 10px 2px rgba(25, 118, 210, 0.5)' : undefined,
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          py: '10px !important',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ overflow: 'hidden' }}>
          <RouterIcon color="primary" fontSize="small" />
          <Typography variant="body2" noWrap title={macAddress} sx={{ maxWidth: 140 }}>
            {macAddress}
          </Typography>
        </Stack>

        <IconButton size="small" onClick={handleSettingsClick}>
          <SettingsIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          onClick={(e) => e.stopPropagation()}
        >
          {rooms.length > 0 && (
            <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Déplacer vers
              </Typography>
              <Select
                size="small"
                displayEmpty
                value={moveTarget}
                onChange={(e) => setMoveTarget(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="" disabled>
                  Choisir une pièce…
                </MenuItem>
                {rooms.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                size="small"
                variant="contained"
                disabled={!moveTarget}
                onClick={() => {
                  onMove(macAddress, moveTarget)
                  setMoveTarget('')
                  setAnchor(null)
                }}
              >
                Déplacer
              </Button>
              <Box sx={{ my: 0.5, borderTop: '1px solid', borderColor: 'divider' }} />
            </Box>
          )}
          <MenuItem onClick={() => { onRemove(macAddress); setAnchor(null) }} sx={{ color: 'error.main' }}>
            Retirer de la pièce
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  )
}
