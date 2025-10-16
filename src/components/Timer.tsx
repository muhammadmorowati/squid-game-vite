import { useGameStore } from "../hooks/UseGameStore"

const Timer = () => {
  const { timeLeft, greenLight } = useGameStore()

  // choose light color
  const lightColor =
    timeLeft <= 0 ? "bg-gray-700" : greenLight ? "bg-green-500" : "bg-red-600"

  return (
    <div
      className="absolute left-1/2 max-sm:left-1/3 -translate-x-1/2 sm:text-2xl 
      bg-black text-red-600 px-4 py-2 rounded-lg flex items-center gap-3"
    >
      {/* time text */}
      <span>{timeLeft}</span>

      {/* small light circle inside timer */}
      <span
        className={`w-6 h-6 rounded-full border border-gray-400 shadow-md ${lightColor}`}
      />
    </div>
  )
}

export default Timer
