
type Props = {
    isGameOver: boolean
    allPlayerFinished: boolean
}

const Finish = (props: Props) => {
    const { isGameOver, allPlayerFinished } = props
  
    return (
        <>
            <div className="bg-red-600 absolute h-1 w-[100vw] top-20">
                <img 
                    className="absolute left-1/2 max-sm:left-1/3 bottom-0" 
                    src={'/tree_prev_ui.png'}
                    alt={'doll'}
                    width={150} 
                    height={150}
                />
            </div>

            {isGameOver && (
                <>
                        <img src={"/lose-game123-ezgif.com-gif-to-webp-converter.webp"} alt={""} />
                            <button className="mt-4">
                                Restart Game
                            </button>
                </>
            )}

            {allPlayerFinished && !isGameOver && (
                <>
                        <img src={"/winning-gif.gif"} alt={""} />
               
                </>
            )}
        </>
    )
}

export default Finish
