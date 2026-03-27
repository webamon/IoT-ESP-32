import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface Props {
  userId: string
  onRoomAdded?: () => void
}

async function createRoom(userId: string, label: string) {
  const response = await fetch('http://localhost:3000/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, label }),
  })
  if (response.status === 409) {
    const { error } = await response.json()
    throw new Error(error)
  }
  return response.json()
}

export function UserRoomForm({ userId, onRoomAdded }: Props) {
  const [label, setLabel] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!label.trim()) return
    try {
      await createRoom(userId, label.trim())
      setLabel('')
      setError(null)
      onRoomAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
    >
      <TextField
        size="small"
        label="Nom de la pièce"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value)
          setError(null)
        }}
        error={!!error}
        helperText={error ?? ' '}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mt: 0.25 }}
      >
        Ajouter
      </Button>
    </Box>
  )
}
