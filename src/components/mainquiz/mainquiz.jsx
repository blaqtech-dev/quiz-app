import { useEffect, useState, useCallback, useRef } from "react"

import {
  useParams,
  useSearchParams
} from "react-router-dom"

import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore"

import { db } from "../firebase"

import { Oval } from "react-loader-spinner"

import { QiuzCard } from "../qiuzcard/qiuzcard"
import { Result } from "../resultpage/result"

import "./mainquiz.css"

export function MainQuiz() {

  const { roomId } = useParams()
  const [searchParams] = useSearchParams()

  const category = searchParams.get("category")
  const player = searchParams.get("player")

  const isMultiplayer = !!roomId

  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)

  const hasFetched = useRef(false)

  // ================= FETCH QUESTIONS =================
  const fetchQuestions = async () => {

    try {

      const url =
        `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`

      // ================= SINGLE PLAYER =================
      if (!isMultiplayer) {

        const res = await fetch(url)
        const data = await res.json()

        setQuestions(data?.results || [])
        return
      }

      // ================= MULTIPLAYER =================
      const roomRef = doc(db, "rooms", roomId)
      const roomSnap = await getDoc(roomRef)

      if (!roomSnap.exists()) return

      const roomData = roomSnap.data()

      // reuse existing questions
      if (roomData?.questions?.length > 0) {
        setQuestions(roomData.questions)
        return
      }

      // 🚨 ONLY PLAYER 1 GENERATES QUESTIONS
      if (player === "1") {

        const res = await fetch(url)
        const data = await res.json()

        const safeQuestions = data?.results || []

        setQuestions(safeQuestions)

        if (safeQuestions.length > 0) {
          await updateDoc(roomRef, {
            questions: safeQuestions
          })
        }

      } else {

        // Player 2 waits for questions
        const interval = setInterval(async () => {

          const snap = await getDoc(roomRef)
          const data = snap.data()

          if (data?.questions?.length > 0) {
            setQuestions(data.questions)
            clearInterval(interval)
          }

        }, 1000)
      }

    } catch (err) {
      console.log("Fetch error:", err)
    }
  }

  // ================= PREVENT DOUBLE FETCH =================
  useEffect(() => {

    if (hasFetched.current) return
    hasFetched.current = true

    fetchQuestions()

  }, [])

  // ================= TIMER =================
  useEffect(() => {

    if (showResult) return
    if (questions.length === 0) return

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev === 1) {
          handleAnswer("")
        }

        return prev - 1
      })

    }, 1000)

    return () => clearInterval(timer)

  }, [questions, showResult])

  // ================= ANSWER HANDLER =================
  const handleAnswer = useCallback(async (answer) => {

    const current = questions[currentQuestion]
    if (!current) return

    const correctAnswer = current.correct_answer
    const isCorrect = answer === correctAnswer

    setScore(prev => {

      const newScore = isCorrect ? prev + 1 : prev

      // MULTIPLAYER UPDATE
      if (isMultiplayer && isCorrect) {

        const roomRef = doc(db, "rooms", roomId)

        if (player === "1") {
          updateDoc(roomRef, {
            player1Score: newScore
          })
        } else {
          updateDoc(roomRef, {
            player2Score: newScore
          })
        }
      }

      return newScore
    })

    const next = currentQuestion + 1

    if (next < questions.length) {

      setCurrentQuestion(next)
      setTimeLeft(15)

    } else {
      setShowResult(true)
    }

  }, [questions, currentQuestion, isMultiplayer, roomId, player])

  // ================= LOADING =================
  if (questions.length === 0) {
    return (
      <div className="loading">
        <Oval height={80} width={80} color="white" />
      </div>
    )
  }

  // ================= UI =================
  return (
    <div className="quiz-page">

      {showResult ? (

        <Result
          roomId={roomId}
          score={score}
          total={questions.length}
          multiplayer={isMultiplayer}
        />

      ) : (

        <QiuzCard
          questionData={questions?.[currentQuestion]}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          handleAnswer={handleAnswer}
          timeLeft={timeLeft}
        />
      )}

    </div>
  )
}