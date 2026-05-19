// src/components/qiuzcard/qiuzcard.jsx

import { useMemo, useState } from "react"

import "./quizcard.css"

export function QiuzCard({
  questionData,
  currentQuestion,
  totalQuestions,
  handleAnswer,
  timeLeft
}) {

  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const [isAnswered, setIsAnswered] = useState(false)

  const answers = useMemo(() => {

    return [
      ...questionData.incorrect_answers,
      questionData.correct_answer
    ].sort(() => Math.random() - 0.5)

  }, [questionData])

  const handleClick = (answer) => {

    if (isAnswered) return

    setSelectedAnswer(answer)

    setIsAnswered(true)

    setTimeout(() => {

      handleAnswer(answer)

      setSelectedAnswer(null)

      setIsAnswered(false)

    }, 1000)
  }

  return (
    <div className="quiz-card">

      <h2>Time Left: {timeLeft}s</h2>

      <h3>
        Question {currentQuestion + 1} / {totalQuestions}
      </h3>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width:
              `${((currentQuestion + 1) / totalQuestions) * 100}%`
          }}
        />
      </div>

      <h1
        dangerouslySetInnerHTML={{
          __html: questionData.question
        }}
      />

      <div className="answers">

        {
          answers.map((answer, index) => {

            const isCorrect =
              answer === questionData.correct_answer

            const isSelected =
              answer === selectedAnswer

            return (
              <button
                key={index}
                onClick={() => handleClick(answer)}
                disabled={isAnswered}
                className={
                  isAnswered
                    ? isCorrect
                      ? "correct"
                      : isSelected
                      ? "wrong"
                      : ""
                    : ""
                }
                dangerouslySetInnerHTML={{
                  __html: answer
                }}
              />
            )
          })
        }

      </div>

    </div>
  )
}