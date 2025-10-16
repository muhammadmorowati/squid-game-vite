import { useGameStore } from "../hooks/UseGameStore"

const Timer = () => {

    const {timeLeft} = useGameStore()
  return (
     <h1
        className="absolute left-1/2 sm:text-2xl max-sm:left-1/3 bg-black text-red-600 p-1 rounded-lg"
      >
        {timeLeft}
      </h1>
  )
}

export default Timer