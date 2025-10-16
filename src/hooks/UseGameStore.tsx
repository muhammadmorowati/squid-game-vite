import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Random } from 'random-js'

export type ContestantType = {
  x: number
  y: number
  name: string
  gameOver: boolean
  speed: number
  winner: boolean
}

type Phase = 'idle' | 'countdown' | 'running' | 'finished'

type GameState = {
  timeLeft: number
  gameStarted: boolean
  allFinished: boolean
  gameOver: boolean
  greenLight: boolean
  greenLightCounter: number
  moving: boolean
  phase: Phase
  player: ContestantType
  contestants: ContestantType[]

  setGameStarted: (value: boolean) => void
  onMoveStart: () => void
  onMoveStop: () => void
  resetGame: () => void
}

// --- Safe window access ---
const getWindowSafe = () => (typeof window !== 'undefined' ? window : undefined)

export const useGameStore = create(
  subscribeWithSelector<GameState>((set, get) => {
    const random = new Random()

    // 🧍‍♂️ Generate player and bots dynamically based on screen size
    const generatePlayer = (): ContestantType => {
      const w = getWindowSafe()
      if (!w)
        return { x: 0, y: 0, name: 'player', gameOver: false, speed: 0, winner: false }

      const screenHeight = w.innerHeight
      const playerSpeedFactor = screenHeight / 1300
      return {
        x: Math.random() * (w.innerWidth - w.innerWidth * 0.052),
        y: screenHeight * 0.90,
        name: 'player',
        gameOver: false,
        speed: random.real(playerSpeedFactor * 1.0, playerSpeedFactor * 1.6, true),
        winner: false,
      }
    }

    const generateContestants = (): ContestantType[] => {
      const w = getWindowSafe()
      if (!w) return []
      const screenHeight = w.innerHeight
      const speedFactor = screenHeight / 1300
      return Array.from({ length: 50 }, (_, i) => ({
        x: Math.random() * (w.innerWidth - w.innerWidth * 0.052),
        y: screenHeight * 0.90,
        name: i.toString(),
        gameOver: false,
        speed: random.real(speedFactor * 0.7, speedFactor * 1.2, true),
        winner: false,
      }))
    }

    // --- Internal control refs ---
    let animationRef: number | null = null
    let lastFrameTime = performance.now()
    let timerId: NodeJS.Timeout | null = null
    let lightTimer: NodeJS.Timeout | null = null
    let countdownTimer: NodeJS.Timeout | null = null

    // --- Helpers ---
    const checkAllFinished = (player: ContestantType, contestants: ContestantType[]) => {
      if (!player.winner && !player.gameOver) return false
      return contestants.every(c => c.winner || c.gameOver)
    }

    const stopAllTimers = () => {
      cancelAnimationFrame(animationRef ?? 0)
      if (timerId) clearInterval(timerId)
      if (lightTimer) clearTimeout(lightTimer)
      if (countdownTimer) clearTimeout(countdownTimer)
    }

    // --- Render loop ---
    const render = () => {
      const { phase, greenLight, moving, player, contestants } = get()
      if (phase !== 'running') return

      const currentTime = performance.now()
      const delta = (currentTime - lastFrameTime) / (1000 / 60)
      lastFrameTime = currentTime

      const newPlayer = { ...player }
      const newContestants = contestants.map(c => ({ ...c }))

      // --- Player logic ---
      if (!newPlayer.winner && !newPlayer.gameOver && greenLight && moving) {
        newPlayer.y -= newPlayer.speed * delta
        if (newPlayer.y <= 20) {
          newPlayer.y = 20
          newPlayer.winner = true
        }
      } else if (!greenLight && moving && !newPlayer.winner && !newPlayer.gameOver) {
        newPlayer.gameOver = true
        set({ moving: false })
      }

      // --- AI contestants ---
      for (const c of newContestants) {
        if (c.y <= 20) {
          c.y = 20
          c.winner = true
        } else if (!c.winner && !c.gameOver) {
          if (greenLight && Math.random() < 0.7) {
            c.y -= c.speed * delta
          } else if (!greenLight && Math.random() * 1000 < 1 && c.y > 20) {
            c.gameOver = true
          }
        }
      }

      const allFinished = checkAllFinished(newPlayer, newContestants)
      const gameOver = newPlayer.gameOver

      set({ player: newPlayer, contestants: newContestants, allFinished, gameOver })
      animationRef = requestAnimationFrame(render)
    }

    // --- Light switch control ---
    const switchLight = () => {
      const { phase } = get()
      if (phase !== 'running') return

      const nextIsGreen = !get().greenLight
      const duration = nextIsGreen
        ? random.integer(2000, 4000)
        : random.integer(2000, 3000)

      set({
        greenLight: nextIsGreen,
        greenLightCounter: Math.floor(duration / (1000 / 60)),
      })

      lightTimer = setTimeout(switchLight, duration)
    }

    // --- Main state ---
    return {
      timeLeft: 60,
      gameStarted: false,
      allFinished: false,
      gameOver: false,
      greenLight: false,
      greenLightCounter: 0,
      moving: false,
      phase: 'idle',
      player: { x: 0, y: 0, name: '', gameOver: false, speed: 0, winner: false },
      contestants: [],

      // 🕹 Start the game
      setGameStarted: (value: boolean) => {
        stopAllTimers()

        if (value) {
          const newPlayer = generatePlayer()
          const newContestants = generateContestants()

          // --- Step 1: Countdown Phase ---
          set({
            gameStarted: true,
            phase: 'countdown',
            timeLeft: 60,
            greenLight: false,
            gameOver: false,
            allFinished: false,
            player: newPlayer,
            contestants: newContestants,
          })

          // Optional: play “Green Light Red Light” intro sound here
          const countdownDuration = 3000 // 3 seconds delay before game starts

          countdownTimer = setTimeout(() => {
            // --- Step 2: Switch to running phase ---
            set({ phase: 'running' })
            lastFrameTime = performance.now()
            animationRef = requestAnimationFrame(render)
            switchLight()

            // --- Step 3: Start game timer ---
            timerId = setInterval(() => {
              const current = get().timeLeft
              if (current > 0) {
                set({ timeLeft: current - 1 })
              } else {
                clearInterval(timerId!)
                const updatedPlayer = get().player
                const updatedContestants = get().contestants.map(c => {
                  if (c.y > 20) c.gameOver = true
                  return c
                })
                if (updatedPlayer.y > 20) updatedPlayer.gameOver = true
                set({
                  player: updatedPlayer,
                  contestants: updatedContestants,
                  gameOver: updatedPlayer.gameOver,
                  allFinished: checkAllFinished(updatedPlayer, updatedContestants),
                  phase: 'finished',
                })
              }
            }, 1000)
          }, countdownDuration)
        } else {
          set({ gameStarted: false, phase: 'idle' })
        }
      },

      // 🔄 Reset everything
      resetGame: () => {
        stopAllTimers()
        set({
          timeLeft: 60,
          gameStarted: false,
          allFinished: false,
          gameOver: false,
          greenLight: false,
          greenLightCounter: 0,
          moving: false,
          phase: 'idle',
          player: generatePlayer(),
          contestants: generateContestants(),
        })
      },

      // 👟 Player starts moving
      onMoveStart: () => {
        const { greenLight, player, gameStarted, phase } = get()
        if (!gameStarted || phase !== 'running') return
        if (!player.winner && !player.gameOver && greenLight) {
          set({ moving: true })
        } else if (!player.winner) {
          set({
            moving: false,
            player: { ...player, gameOver: true },
            gameOver: true,
          })
        }
      },

      // 🧍‍♂️ Player stops moving
      onMoveStop: () => {
        set({ moving: false })
      },
    }
  })
)
