import { useEffect, useState } from "react"

import {
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore"

import { db } from "../firebase"

import { Link } from "react-router-dom"

import "./result.css"

export function Result({
  roomId,
  score,
  total,
  multiplayer,
  player
}) {

  const isMultiplayer = multiplayer && roomId

  const [p1, setP1] = useState(0)
  const [p2, setP2] = useState(0)

  const [p1Finished, setP1Finished] =
    useState(false)

  const [p2Finished, setP2Finished] =
    useState(false)

  // ================= SINGLE PLAYER =================
  useEffect(() => {

    if (!isMultiplayer) {

      const bestScore =
        localStorage.getItem("highscore") || 0

      if (score > bestScore) {

        localStorage.setItem(
          "highscore",
          score
        )
      }
    }

  }, [score])

  // ================= SAVE FINISHED STATUS =================
  useEffect(() => {

    if (!isMultiplayer) return

    const roomRef =
      doc(db, "rooms", roomId)

    // PLAYER 1 FINISHED
    if (player === "1") {

      updateDoc(roomRef, {
        player1Finished: true
      })
    }

    // PLAYER 2 FINISHED
    else {

      updateDoc(roomRef, {
        player2Finished: true
      })
    }

  }, [])

  // ================= REALTIME ROOM =================
  useEffect(() => {

    if (!isMultiplayer) return

    const unsub = onSnapshot(

      doc(db, "rooms", roomId),

      (docSnap) => {

        const data = docSnap.data()

        if (!data) return

        setP1(data.player1Score || 0)
        setP2(data.player2Score || 0)

        setP1Finished(
          data.player1Finished || false
        )

        setP2Finished(
          data.player2Finished || false
        )
      }
    )

    return () => unsub()

  }, [roomId])

  // ================= BOTH PLAYERS FINISHED =================
  const bothFinished =
    p1Finished && p2Finished

  // ================= WINNER =================
  const winner =
    p1 > p2
      ? "🏆 Player 1 Wins"
      : p2 > p1
      ? "🏆 Player 2 Wins"
      : "🤝 Draw"

  // ================= UI =================
  return (

    <div className="result">
        <div className='result-card'>

      {

        isMultiplayer ? (

          <>

            <h1>
              Multiplayer Result
            </h1>

            <div className="player-score">

              <h2>
                Player 1:
                {" "}
                {p1Finished
                  ? p1
                  : "Waiting..."}
              </h2>

              <h2>
                Player 2:
                {" "}
                {p2Finished
                  ? p2
                  : "Waiting..."}
              </h2>

            </div>

            {

              !bothFinished ? (

                <div className="waiting-box">

                  <div className="loader"></div>

                  <p>
                    Waiting for other player
                    to finish...
                  </p>

                </div>

              ) : (

                <div className="winner-box">

                  <h1>
                    {winner}
                  </h1>

                </div>

              )
            }

          </>

        ) : (

          <>

            <h1>
              Quiz Finished
            </h1>

            <h2>
              Your Score:
              {" "}
              {score}
              {" / "}
              {total}
            </h2>

            <h3>

              High Score:
              {" "}

              {
                localStorage.getItem(
                  "highscore"
                ) || 0
              }

            </h3>

          </>

        )
      }

      <Link to="/">
        <button>
          Back Home
        </button>
      </Link>
</div>
    </div>
  )
}