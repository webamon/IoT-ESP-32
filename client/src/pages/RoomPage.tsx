import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { getRooms, getRoomDevices } from '../api/rooms'
import { updateDeviceRoom, removeDeviceFromRoom, getUnassignedDevices } from '../api/devices'
import { useWS } from '../contexts/WSProvider'
import { DeviceList } from '../components/DeviceList'
import { DeviceGraphs } from '../components/DeviceGraphs'
import type { SensorData } from '../../../server/src/services/sensor-service'

interface Props {
  userId: string
}

export function RoomPage({ userId }: Props) {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [from, setFrom] = useState<Dayjs>(dayjs().subtract(1, 'day'))
  const [to, setTo] = useState<Dayjs>(dayjs())
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [liveData, setLiveData] = useState<SensorData[]>([])

  const { data: rooms = [] } = useQuery<{ id: string; label: string }[]>({
    queryKey: ['rooms', userId],
    queryFn: () => getRooms(userId),
  })
  const room = rooms.find((r) => r.id === roomId)
  const otherRooms = rooms.filter((r) => r.id !== roomId)

  const { data: devices = [] } = useQuery<{ mac_address: string }[]>({
    queryKey: ['rooms', roomId, 'devices'],
    queryFn: () => getRoomDevices(roomId!),
    enabled: !!roomId,
  })

  const { data: unassignedDevices = [] } = useQuery<{ mac_address: string }[]>({
    queryKey: ['devices', 'unassigned'],
    queryFn: () => getUnassignedDevices(),
  })

  const effectiveDevice =
    selectedDevice && devices.find((d) => d.mac_address === selectedDevice)
      ? selectedDevice
      : (devices[0]?.mac_address ?? null)

  const deviceMacs = devices.map((d) => d.mac_address)
  const { subscribe } = useWS()

  const handleWsMessage = useCallback(
    (sensorDatas: SensorData[]) => {
      const relevant = sensorDatas.filter((d) => deviceMacs.includes(d.deviceId))
      if (relevant.length === 0) return
      const time = dayjs(relevant[0].time)
      if (time.isBefore(from, 'day') || time.isAfter(to, 'day')) return
      setLiveData((prev) => [...prev, ...relevant])
    },
    [deviceMacs, from, to]
  )

  useEffect(() => {
    return subscribe((e: MessageEvent) => {
      const { type, payload } = JSON.parse(e.data)
      if (type === 'sensor:data') handleWsMessage(payload as SensorData[])
    })
  }, [handleWsMessage, subscribe])

  const removeMutation = useMutation({
    mutationFn: (macAddress: string) => removeDeviceFromRoom(macAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['devices', 'unassigned'] })
    },
  })

  const moveMutation = useMutation({
    mutationFn: ({ macAddress, targetRoomId }: { macAddress: string; targetRoomId: string }) =>
      updateDeviceRoom(macAddress, targetRoomId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  })

  const addMutation = useMutation({
    mutationFn: (macAddress: string) => updateDeviceRoom(macAddress, roomId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['devices', 'unassigned'] })
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 3, py: 2 }}>
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ textTransform: 'capitalize', flex: 1 }}>
            {room?.label ?? '…'}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <DeviceList
            devices={devices}
            unassignedDevices={unassignedDevices}
            selectedDevice={effectiveDevice}
            otherRooms={otherRooms}
            onSelect={setSelectedDevice}
            onMove={(mac, targetRoomId) => moveMutation.mutate({ macAddress: mac, targetRoomId })}
            onRemove={(mac) => removeMutation.mutate(mac)}
            onAdd={(mac) => addMutation.mutate(mac)}
          />

          <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack direction="row" spacing={2}>
              <DatePicker label="Du" value={from} onChange={(v) => v && setFrom(v)} maxDate={to} />
              <DatePicker label="Au" value={to} onChange={(v) => v && setTo(v)} minDate={from} />
            </Stack>

            {effectiveDevice ? (
              <DeviceGraphs
                macAddress={effectiveDevice}
                from={from}
                to={to}
                liveData={liveData}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sélectionne un device pour afficher ses graphiques.
              </Typography>
            )}
          </Box>
        </Box>

      </Box>
    </LocalizationProvider>
  )
}
