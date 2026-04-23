import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { CircularProgress, Box } from '@mui/material'
import type { UserPayload } from '../../../server/src/domain/user'
import { me } from '../api/me'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user === null && !loading && window.location.pathname !== '/login') {
      // User is not authenticated on redirige vers la page login
      window.location.href = '/login'
    }
  }, [user, loading])

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      return await me()
    }

    fetchUser()
      .then((user) => {
        console.log('user', user)

        setLoading(false)
        setUser(user)
      })
      .catch((error) => {
        console.log('error', error)

        setLoading(false)
        setUser(null)
      })
  }, [])
  console.log(loading, user)
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    )

  return (
    <AuthContext.Provider value={{ user }}>{children} </AuthContext.Provider>
  )
}
