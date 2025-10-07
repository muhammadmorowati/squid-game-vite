
import { useEffect, useState } from "react"
import Contestant from "./Contestant"
import DollMusic from "./DollMusic"
import Finish from "./Finish"
import { useGameStore } from "./UseGameStore"

const Game = () => {
  const {
    timeLeft,
    player,
    contestants,
    allFinished,
    greenLightCounter,
    greenLight,
    onMoveStart,
    onMoveStop,
    setGameStarted,
    gameStarted,
  } = useGameStore()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading || !gameStarted) {
    return (
      <div className="w-full h-screen bg-pink-400 flex justify-center items-center">
        <div className="sm:min-h-96 rounded sm:w-[500px] w-[90%] bg-slate-400 p-6 flex flex-col items-center">
          <img src="/squid-game-start.jpg" alt="squid-game-start" width={400} height={300} />
          <h1 className="text-2xl font-medium text-white my-3">Squid Game Online</h1>
          {!loading ? (
            <button onClick={() => setGameStarted(true)} color="secondary" >
              Start Game
            </button>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-orange-300 h-screen w-screen absolute">
      <h1 className="absolute left-1/2 sm:text-2xl max-sm:left-1/3 bg-black text-red-600 p-1 rounded-lg">
        {timeLeft}
      </h1>

      <button
        className="absolute border left-1/2 top-1/3 min-[2000px]:w-40 min-[2000px]:h-20 min-[2000px]:text-3xl"
        onMouseEnter={onMoveStart}
        onMouseLeave={onMoveStop}
        onTouchStart={onMoveStart}
        onTouchEnd={onMoveStop}
      >
        Move
      </button>

      <Finish isGameOver={player.gameOver} allPlayerFinished={allFinished} />

      <img className="absolute left-1/2 max-sm:left-1/3 z-50" src="/doll.png" alt="doll" width={150} height={150} />

      <Contestant x={player.x} y={player.y} name={player.name} gameOver={player.gameOver} />

      {contestants.map((c) => (
        <Contestant key={c.name} x={c.x} y={c.y} name={c.name} gameOver={c.gameOver} />
      ))}

      <DollMusic
        greenLight={greenLight}
        greenLightDuration={greenLightCounter}
        // allPlayerFinished={allFinished}
        // playerGameOver={player.gameOver}
      />
    </div>
  )
}

export default Game
