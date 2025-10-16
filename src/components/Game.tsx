import Contestant from "./Contestant"
import DollMusic from "./DollMusic"
import Finish from "./Finish"
import { useGameStore } from "../hooks/UseGameStore"
import HomePage from "./HomePage"
import PlayerButton from "./PlayerButton"
import Timer from "./Timer"

const Game = () => {

  const {
    player,
    contestants,
    gameStarted,
   
  } = useGameStore()

  if (!gameStarted) {

    return (
      
        <HomePage />
    )
  }

  return (
    <div
      className="bg-orange-300 h-screen w-screen absolute"
    >
     <Timer/>

     <PlayerButton/>

      <Finish />

      <img 
      className="absolute left-1/2 max-sm:left-1/3 z-50"
       src="/doll.png"
       alt="doll" 
      width={150}
       height={150} 
      />

      <Contestant
       x={player.x}
       y={player.y}
       name={player.name}
       gameOver={player.gameOver} 
      />

      {contestants.map((c) => (
        <Contestant
          key={c.name}
          x={c.x}
          y={c.y}
          name={c.name}
          gameOver={c.gameOver}
        />
      ))}

      <DollMusic />
    </div>
  )
}

export default Game
