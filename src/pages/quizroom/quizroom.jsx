import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { listenRoom,updateScore } from "../../components/room.js"

export function QuizRoom() {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)

  useEffect(() => {
    const unsub = listenRoom(roomId, setRoom)
    return () => unsub()
  }, [roomId])

  if (!room) return <h2>Loading...</h2>

  return (
    <div>
      <h1>Room: {roomId}</h1>

      <h2>Player 1: {room.player1Score}</h2>
      <h2>Player 2: {room.player2Score}</h2>

      <button onClick={() => updateScore(roomId, "p1")}>
        Player 1 Answer
      </button>

      <button onClick={() => updateScore(roomId, "p2")}>
        Player 2 Answer
      </button>
    </div>
  )
}