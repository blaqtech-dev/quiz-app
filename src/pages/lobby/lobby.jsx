import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore"

import { db } from "../../components/firebase"

import "./lobby.css"

export function Lobby() {

  const [roomId, setRoomId] = useState("")
  const [createdRoom, setCreatedRoom] = useState("")
  const [waiting, setWaiting] = useState(false)

  const navigate = useNavigate()

  // ================= CREATE ROOM =================
  const createRoom = async () => {

    const randomRoom =
      Math.random().toString(36).substring(2, 8)

    await setDoc(doc(db, "rooms", randomRoom), {
      player1Score: 0,
      player2Score: 0,
      player2Joined: false,
      questions: [],
      createdAt: Date.now()
    })

    setCreatedRoom(randomRoom)
    setWaiting(true)
  }

  // ================= WAIT FOR PLAYER 2 =================
  useEffect(() => {

    if (!createdRoom) return

    const unsub = onSnapshot(
      doc(db, "rooms", createdRoom),
      (docSnap) => {

        const data = docSnap.data()

        if (data?.player2Joined) {

          navigate(
            `/quiz/${createdRoom}?player=1&category=18`
          )
        }
      }
    )

    return () => unsub()

  }, [createdRoom])

  // ================= JOIN ROOM =================
  const joinRoom = async () => {

    if (!roomId) return

    const roomRef = doc(db, "rooms", roomId)

    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      alert("Room does not exist")
      return
    }

    // MARK PLAYER 2 AS JOINED
    await updateDoc(roomRef, {
      player2Joined: true
    })

    navigate(
      `/quiz/${roomId}?player=2&category=18`
    )
  }

  // ================= COPY ROOM ID =================
  const copyRoomId = async () => {

    await navigator.clipboard.writeText(createdRoom)

    alert("Room ID copied!")
  }

  // ================= WAITING SCREEN =================
  if (waiting) {

    return (
      <div className="lobby">

        <div className="lobby-card">

          <h1>Waiting For Player 2...</h1>

          <h2 className="room-code">
            {createdRoom}
          </h2>

          <button onClick={copyRoomId}>
            Copy Room ID
          </button>

          <div className="loader"></div>

        </div>

      </div>
    )
  }

  // ================= NORMAL SCREEN =================
  return (
    <div className="lobby">

      <div className="lobby-card">

        <h1>Quiz Multiplayer</h1>

        <button onClick={createRoom}>
          Create Room
        </button>

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) =>
            setRoomId(e.target.value)
          }
        />

        <button onClick={joinRoom}>
          Join Room
        </button>

      </div>

    </div>
  )
}