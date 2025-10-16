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

             <img 
                    className="absolute left-1/2 max-sm:left-1/3 bottom-0" 
                    src={'/tree_prev_ui.png'}
                    alt={'doll'}
                    width={150} 
                    height={150}
                />
            </div>

            {allFinished && !gameOver && (             
                <Winner />
            )}
        </>
    )
}

export default Finish
