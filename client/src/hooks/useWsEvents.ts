import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useWS } from '../contexts/WSProvider'

export function useWsEvents() {
  const queryClient = useQueryClient()
  const { subscribe } = useWS()

  useEffect(() => {
    return subscribe((e: MessageEvent) => {
      const { type } = JSON.parse(e.data)
      if (type === 'room:created') {
        console.log('aaaaaaaaaaaaaaaaaaaah')
        queryClient.invalidateQueries({ queryKey: ['rooms'] })
      }
    })
  }, [subscribe, queryClient])
}
