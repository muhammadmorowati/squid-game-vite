import Contestant from "./Contestant"
import DollMusic from "./DollMusic"
import Finish from "./Finish"
import { useGameStore } from "../hooks/UseGameStore"
import HomePage from "./HomePage"
import PlayerButton from "./PlayerButton"
import Timer from "./Timer"
import { useState, useEffect } from "react"

const Game = () => {
  const {
    player,
    contestants,
    gameStarted,
    phase,
  } = useGameStore()

  const [countdown, setCountdown] = useState(3)

  // 🔢 Show countdown during "countdown" phase
  useEffect(() => {
    if (phase === "countdown") {
      setCountdown(3)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [phase])

  // 🏠 Show Home Page before game starts
  if (!gameStarted || phase === "idle") {
    return <HomePage />
  }

  return (
    <div className="bg-orange-300 h-screen w-screen absolute overflow-hidden">
      {/* Timer should only tick when phase === 'running' */}
      {phase === "running" && <Timer />}

      {/* Show countdown overlay during 'countdown' */}
      {phase === "countdown" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <h1 className="text-white text-[clamp(50px,10vw,120px)] font-bold">
            {countdown > 0 ? countdown : "Go!"}
          </h1>
        </div>
      )}

      {/* Player Controls */}
      <PlayerButton />

      {/* Finish Line */}
      <Finish />

      {/* Doll Image */}
      <img
        className="absolute left-1/2 -translate-x-1/2 z-40 max-sm:left-1/3"
        src="doll.png"
        alt="doll"
        width={150}
        height={150}
      />

      {/* Player */}
      <Contestant
        x={player.x}
        y={player.y}
        name={player.name}
        gameOver={player.gameOver}
      />

      {/* Contestants */}
      {contestants.map((c) => (
        <Contestant
          key={c.name}
          x={c.x}
          y={c.y}
          name={c.name}
          gameOver={c.gameOver}
        />
      ))}

      {/* Doll Sound */}
      <DollMusic />
    </div>
  )
}

export default Game
