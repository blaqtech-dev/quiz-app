import { useState,useEffect } from "react"

import { onSnapshot,doc } from "firebase/firestore"
import { db } from "../firebase"
import './result.css'
import { Link } from "react-router-dom"

export function Result({ roomId, score, total }) {

  const isMultiplayer = !!roomId

  const [p1, setP1] = useState(0)
  const [p2, setP2] = useState(0)

  useEffect(() => {

    if (!isMultiplayer) {

      const bestScore =
        localStorage.getItem("highscore") || 0

      if (score > bestScore) {
        localStorage.setItem("highscore", score)
      }
    }

  }, [score, isMultiplayer])

  useEffect(() => {

    if (!isMultiplayer || !roomId) return

    const unsub = onSnapshot(
      doc(db, "rooms", roomId),
      (docSnap) => {

        const data = docSnap.data()
        if (!data) return

        setP1(data.player1Score || 0)
        setP2(data.player2Score || 0)
      }
    )

    return () => unsub()

  }, [roomId, isMultiplayer])

  const winner =
    p1 > p2
      ? "Player 1 Wins"
      : p2 > p1
      ? "Player 2 Wins"
      : "Draw"

  return (
    <div className="result">

      {isMultiplayer ? (

        <>
          <h1>Game Finished</h1>
          <h2>Player 1: {p1}</h2>
          <h2>Player 2: {p2}</h2>
          <h1>{winner}</h1>
        </>

      ) : (

        <>
          <h1>Quiz Finished</h1>

          <h2>Your Score: {score} / {total}</h2>

          <h3>
            High Score: {localStorage.getItem("highscore") || 0}
          </h3>
        </>
      )}
<Link to='/'>
<button>Go Back Home</button>
</Link>

    </div>
  )
}