import { useGameStore } from "../hooks/UseGameStore"

const PlayerButton = () => {

    const {onMoveStart,
        onMoveStop,
        gameOver,
    resetGame} = useGameStore()
    
  return (
    <>
       {!gameOver ? (<button
        className="absolute border left-1/2 top-1/3 min-[2000px]:w-40 min-[2000px]:h-20 min-[2000px]:text-3xl z-50"
        onMouseEnter={onMoveStart}
        onMouseLeave={onMoveStop}
        onTouchStart={onMoveStart}
        onTouchEnd={onMoveStop}
      >
        Move
      </button>) : (
          <button
                      className="absolute border left-1/2 top-1/3 min-[2000px]:w-40 min-[2000px]:h-20 min-[2000px]:text-3xl z-50"
                      onClick={resetGame}
          >
            restart game
          </button>
      )}
    </>
  )
}

export default PlayerButton
