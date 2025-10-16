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
         <button
            className="font-sans cursor-pointer mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition duration-300"
            onClick={() => setGameStarted(true)}
          >

            Start Game

          </button>
        </div>
      </div>
    )
}

export default HomePage