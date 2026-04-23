import { createContext, useContext } from 'react'
import type { UserPayload } from '../../../server/src/domain/user'

export interface AuthContextValue {
  user: UserPayload | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useMe() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useMe must be used inside AuthProvider')
  return ctx
}
