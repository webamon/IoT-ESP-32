import { useState } from 'react'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { logUser } from '../api/auth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await logUser(email, password)
      window.location.href = '/rooms'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={3}>
          Connexion
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" fullWidth>
            Se connecter
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
