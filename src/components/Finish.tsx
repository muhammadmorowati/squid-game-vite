import { useGameStore } from "../hooks/UseGameStore"

const Finish = () => {

    const { gameOver, allFinished } = useGameStore()
  
    return (
        <>
            <div
                className="bg-red-600 absolute h-1 w-[100vw] top-20"
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
                <>
               
                </>
            )}
        </>
    )
}

export default Finish
