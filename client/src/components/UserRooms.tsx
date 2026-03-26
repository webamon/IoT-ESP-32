import { useEffect, useState } from 'react'

interface Props {
  userId: string
}

async function fetchRooms(userId: string) {
  const response = await fetch(`http://localhost:3000/rooms?userId=${userId}`)
  return response.json()
}

export function UserRooms({ userId }: Props) {
  const [rooms, setRooms] = useState<{ id: string; label: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await fetchRooms(userId)
      setRooms(rooms)
    }

    fetchData()
  }, [userId])

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>{room.label}</div>
      ))}
    </div>
  )
}
