import { useGameStore } from "../hooks/UseGameStore"

const HomePage = () => {

    const { setGameStarted } = useGameStore()
    
    return (
         <div
        className="w-full h-screen bg-pink-400 flex justify-center items-center"
      >
        <div
          className="sm:min-h-96 rounded sm:w-[500px] w-[90%] bg-slate-400 p-6 flex flex-col items-center"
        >
          <img 
          src="/squid-game-start.jpg" 
            alt="squid-game-start"
            width={400}
           height={300} 
          />
          <h1 className="text-2xl font-medium text-white my-3">
            Squid Game Online
          </h1>
            <button onClick={() => setGameStarted(true)} color="secondary" >
              Start Game
            </button>
        </div>
      </div>
    )
}

export default HomePage