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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRoom } from '../api/rooms'

interface Props {
  userId: string
}

export function UserRoomForm({ userId }: Props) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (label: string) => createRoom(userId, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', userId] })
      handleClose()
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    },
  })

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setLabel('')
    setError(null)
  }

  const handleSubmit = () => {
    if (!label.trim()) return
    mutation.mutate(label.trim())
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
