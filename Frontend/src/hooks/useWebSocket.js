import { useEffect, useRef, useState } from 'react'
import { websocketService } from '../services/websocketService'

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const listenersRef = useRef(new Map())

  useEffect(() => {
    websocketService.connect()

    const handleConnected = () => setIsConnected(true)
    const handleDisconnected = () => setIsConnected(false)

    websocketService.on('connected', handleConnected)
    websocketService.on('disconnected', handleDisconnected)

    return () => {
      websocketService.off('connected', handleConnected)
      websocketService.off('disconnected', handleDisconnected)
      websocketService.disconnect()
    }
  }, [])

  const subscribe = (event, callback) => {
    websocketService.on(event, callback)
    
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, [])
    }
    listenersRef.current.get(event).push(callback)

    return () => {
      websocketService.off(event, callback)
      const listeners = listenersRef.current.get(event)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) listeners.splice(index, 1)
      }
    }
  }

  const send = (type, payload) => {
    websocketService.send(type, payload)
  }

  return {
    isConnected,
    lastMessage,
    subscribe,
    send
  }
}