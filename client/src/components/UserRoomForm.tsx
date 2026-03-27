import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
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
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setLabel('')
    setError(null)
  }

  const handleSubmit = async () => {
    if (!label.trim()) return
    try {
      await createRoom(userId, label.trim())
      handleClose()
      onRoomAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
        Ajouter une pièce
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Nouvelle pièce</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Nom de la pièce"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value)
              setError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            error={!!error}
            helperText={error ?? ' '}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
