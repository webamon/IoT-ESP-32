import { WebSocket } from 'ws'

const clients = new Set<WebSocket>()

export function addWSClient(socket: WebSocket): void {
  clients.add(socket)
  socket.on('close', () => clients.delete(socket))
}

export function broadcastWS(data: object): void {
  const message = JSON.stringify(data)
  clients.forEach(client => client.send(message))
}
