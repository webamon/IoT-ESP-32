import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { BASE_URL } from '../api/config'

const WS_URI = `${BASE_URL.replace('http', 'ws')}/sensor-measures`

type MessageHandler = (event: MessageEvent) => void

interface WSContextValue {
  subscribe: (handler: MessageHandler) => () => void
}

const WSContext = createContext<WSContextValue | null>(null)

export function WSProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null)
  const handlersRef = useRef<Set<MessageHandler>>(new Set())

  useEffect(() => {
    const ws = new WebSocket(WS_URI)
    wsRef.current = ws

    ws.addEventListener('message', (e) => {
      handlersRef.current.forEach((handler) => handler(e))
    })

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  const subscribe = (handler: MessageHandler) => {
    handlersRef.current.add(handler)
    return () => handlersRef.current.delete(handler)
  }

  return <WSContext.Provider value={{ subscribe }}>{children}</WSContext.Provider>
}

export function useWS() {
  const ctx = useContext(WSContext)
  if (!ctx) throw new Error('useWS must be used inside WSProvider')
  return ctx
}
