import { useGameStore } from "../hooks/UseGameStore"

const PlayerButton = () => {

    const {onMoveStart,
           onMoveStop,
           gameOver,
           resetGame} = useGameStore()
    
  const baseButtonClasses = "font-sans absolute left-1/2 transform -translate-x-1/2 top-1/3 min-[2000px]:w-40 min-[2000px]:h-20 min-[2000px]:text-3xl z-50 px-6 py-3 font-bold rounded-lg shadow-lg transition duration-300";

  return (
    <>
       {!gameOver ? (<button
        className={`${baseButtonClasses} bg-blue-500 hover:bg-blue-600 text-white border-blue-700 cursor-pointer`}
        onMouseEnter={onMoveStart}
        onMouseLeave={onMoveStop}
        onTouchStart={onMoveStart}
        onTouchEnd={onMoveStop}
      >
        Move
      </button>) : (
          <button
            className={`${baseButtonClasses} bg-red-500 hover:bg-red-600 text-white border-red-700 cursor-pointer`}
            onClick={resetGame}
          >
            restart game
          </button>
      )}
    </>
  )
}

export default PlayerButton
