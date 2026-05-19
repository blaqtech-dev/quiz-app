import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  increment
} from "firebase/firestore"

import { db } from "./firebase"


export const createRoom = async (roomId) => {
  await setDoc(doc(db, "rooms", roomId), {
    player1Score: 0,
    player2Score: 0,
    currentQuestion: 0,
    player2Joined: false,
    status: "waiting"
  })
}


export const joinRoom = async (roomId) => {
  const ref = doc(db, "rooms", roomId)

  const snap = await getDoc(ref)

  if (!snap.exists()) return false

  await updateDoc(ref, {
    player2Joined: true,
    status: "playing"
  })

  return true
}

export const listenRoom = (roomId, callback) => {
  return onSnapshot(doc(db, "rooms", roomId), (snap) => {
    callback(snap.data())
  })
}

export const updateScore = async (roomId, player) => {
  const field =
    player === "p1" ? "player1Score" : "player2Score"

  await updateDoc(doc(db, "rooms", roomId), {
    [field]: increment(1)
  })
}