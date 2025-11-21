class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 1000
    this.listeners = new Map()
  }

  connect() {
    if (!import.meta.env.VITE_ENABLE_WEBSOCKET) return

    const url = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080'
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.emit('connected')
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.emit(data.type, data.payload)
    }

    this.ws.onclose = () => {
      this.emit('disconnected')
      this.reconnect()
    }

    this.ws.onerror = (error) => {
      this.emit('error', error)
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, this.reconnectInterval * this.reconnectAttempts)
    }
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const websocketService = new WebSocketService()