import { useState } from 'react'
import { Box, Button, Menu, MenuItem, Select, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DeviceCard } from './DeviceCard'

interface Room {
  id: string
  label: string
}

interface Device {
  mac_address: string
}

interface Props {
  devices: Device[]
  unassignedDevices: Device[]
  selectedDevice: string | null
  otherRooms: Room[]
  onSelect: (macAddress: string) => void
  onMove: (macAddress: string, targetRoomId: string) => void
  onRemove: (macAddress: string) => void
  onAdd: (macAddress: string) => void
}

export function DeviceList({
  devices,
  unassignedDevices,
  selectedDevice,
  otherRooms,
  onSelect,
  onMove,
  onRemove,
  onAdd,
}: Props) {
  const [addAnchor, setAddAnchor] = useState<null | HTMLElement>(null)
  const [deviceToAdd, setDeviceToAdd] = useState('')

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 2,
        gap: 1,
        overflowY: 'auto',
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ px: 0.5 }}>
        Devices
      </Typography>

      {devices.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
          Aucun device
        </Typography>
      ) : (
        devices.map((device) => (
          <DeviceCard
            key={device.mac_address}
            macAddress={device.mac_address}
            isSelected={selectedDevice === device.mac_address}
            onClick={() => onSelect(device.mac_address)}
            rooms={otherRooms}
            onMove={onMove}
            onRemove={onRemove}
          />
        ))
      )}

      {unassignedDevices.length > 0 && (
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={(e) => setAddAnchor(e.currentTarget)}
            fullWidth
          >
            Ajouter
          </Button>
          <Menu
            anchorEl={addAnchor}
            open={Boolean(addAnchor)}
            onClose={() => setAddAnchor(null)}
          >
            <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Device non assigné
              </Typography>
              <Select
                size="small"
                displayEmpty
                value={deviceToAdd}
                onChange={(e) => setDeviceToAdd(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="" disabled>
                  Choisir…
                </MenuItem>
                {unassignedDevices.map((d) => (
                  <MenuItem key={d.mac_address} value={d.mac_address}>
                    {d.mac_address}
                  </MenuItem>
                ))}
              </Select>
              <Button
                size="small"
                variant="contained"
                disabled={!deviceToAdd}
                onClick={() => {
                  onAdd(deviceToAdd)
                  setDeviceToAdd('')
                  setAddAnchor(null)
                }}
              >
                Ajouter
              </Button>
            </Box>
          </Menu>
        </Box>
      )}
    </Box>
  )
}
