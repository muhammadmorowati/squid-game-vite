import { useGameStore } from "../hooks/UseGameStore"
import Winner from "./Winner"

const Finish = () => {

    const { gameOver, allFinished } = useGameStore()
  
    return (
        <>
            <div
                className="bg-red-600 absolute h-1 w-[100vw] top-20 max-sm:top-14"
            >
                   {/* 🏴 Condolence ribbon (only visible when player is dead) */}
      {gameOver && (
                <span
          className="absolute left-0 top-0 w-full h-full pointer-events-none"
          style={{
            borderTop: "14px solid black",
            transform: "rotate(-45deg)",
            transformOrigin: "0 0",
            opacity: 0.9,
          }}
        ></span>
)}

            </div>

            {allFinished && !gameOver && (             
                <Winner />
            )}
        </>
    )
}

export default Finish
