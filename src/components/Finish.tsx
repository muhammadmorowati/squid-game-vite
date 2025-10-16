import { useGameStore } from "../hooks/UseGameStore"
import Winner from "./Winner"

const Finish = () => {

    const { gameOver, allFinished } = useGameStore()
  
    return (
        <>
            <div
                className="bg-red-600 absolute h-1 w-[100vw] top-20 max-sm:top-14"
            >
                <img 
                    className="absolute left-1/2 max-sm:left-1/3 bottom-0" 
                    src={'/tree_prev_ui.png'}
                    alt={'doll'}
                    width={150} 
                    height={150}
                />
            </div>

            {allFinished && !gameOver && (
                // <Winner />
                <></>
            )}
        </>
    )
}

export default Finish
