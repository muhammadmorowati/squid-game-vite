import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  x: number
  y: number
  name: string
  gameOver: boolean
  isPlayer?: boolean
}

const Contestant = ({ x, y, name, gameOver, isPlayer = false }: Props) => {

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // 🎯 Preload bullet sound
    const preloadBullet = new Audio("sounds/MLG sniper sound effect.mp3")
    preloadBullet.load()
  }, [])

  useEffect(() => {
    if (gameOver) {
      const bulletSound = new Audio("sounds/MLG sniper sound effect.mp3")
      bulletSound.play()
      setTimeout(() => setVisible(false), 1000)
    }
  }, [gameOver])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="absolute flex flex-col items-center"
        key={name}
        style={{ left: `${x}px`, top: `${y}px` }}
        initial={{ opacity: 1, scale: 1 }}
        animate={
          gameOver
            ? { scale: [1, 1.5, 0], opacity: [1, 0.5, 0] }
            : {}
        }
        transition={{ duration: 1, ease: "easeOut" }}
        exit={{ opacity: 0 }}
      >
        {/* 🏷️ Add label or arrow for player */}
        {isPlayer && (
          <div className="mb-1 text-yellow-300 font-bold text-xs md:text-sm animate-pulse">
            ⬇
          </div>
        )}

        <div
          className={`relative rounded-full ${
            isPlayer ? "ring-4 ring-yellow-400" : ""
          }`}
        >
          <img
            src={gameOver ? "kill-blood.png" : "player.png"}
            alt={gameOver ? "explosion" : "player"}
            width={40}
            height={40}
            className="max-sm:w-10 max-sm:h-12"
          />
          <div
            className="absolute inset-0 top-2 flex justify-center items-center text-white text-xs md:font-bold max-md:text-[6px]"
          >
            {name}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Contestant
