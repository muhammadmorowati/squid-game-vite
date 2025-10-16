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

// --- utility guards for SSR safety ---
const getWindowSafe = () => (typeof window !== 'undefined' ? window : undefined)

export const useGameStore = create(
  subscribeWithSelector<GameState>((set, get) => {
    const random = new Random()

    const generatePlayer = (): ContestantType => {
      const w = getWindowSafe()
      if (!w)
        return { x: 0, y: 0, name: 'player', gameOver: false, speed: 0, winner: false }

      const screenHeight = w.innerHeight
      const playerSpeedFactor = screenHeight / 1000
      return {
        x: Math.random() * (w.innerWidth - w.innerWidth * 0.052),
        y: screenHeight * 0.87,
        name: 'player',
        gameOver: false,
        speed:
          playerSpeedFactor < 1.3
            ? random.real(playerSpeedFactor , playerSpeedFactor * 2, true)
            : random.real(playerSpeedFactor * 2, playerSpeedFactor * 3, true),
        winner: false,
      }
    }

    const generateContestants = (): ContestantType[] => {
      const w = getWindowSafe()
      if (!w) return []
      const screenHeight = w.innerHeight
      const speedFactor = screenHeight / 1700
      return Array.from({ length: 50 }, (_, i) => ({
        x: Math.random() * (w.innerWidth - w.innerWidth * 0.052),
        y: screenHeight * 0.87,
        name: i.toString(),
        gameOver: false,
        speed:
          speedFactor < 1.3
            ? random.real(speedFactor / 2, speedFactor, true)
            : random.real(speedFactor, speedFactor * 1.1, true),
        winner: false,
      }))
    }

    let animationRef: number | null = null
    let lastFrameTime = performance.now()
    let timerId: NodeJS.Timeout | null = null
    let lightTimer: NodeJS.Timeout | null = null

    const checkAllFinished = (player: ContestantType, contestants: ContestantType[]) => {
      if (!player.winner && !player.gameOver) return false
      return contestants.every(c => c.winner || c.gameOver)
    }

    const render = () => {
      const { gameStarted, greenLight, moving, player, contestants } = get()
      if (!gameStarted) return

      const currentTime = performance.now()
      const delta = (currentTime - lastFrameTime) / (1000 / 60)
      lastFrameTime = currentTime

      const newPlayer = { ...player }
      const newContestants = contestants.map(c => ({ ...c }))

      // --- player logic ---
      if (!newPlayer.winner && !newPlayer.gameOver && greenLight && moving) {
        newPlayer.y -= newPlayer.speed * delta
        if (newPlayer.y <= 20) {
          newPlayer.y = 20
          newPlayer.winner = true
        }
      } else if (!greenLight && moving && !newPlayer.winner && !newPlayer.gameOver) {
        // small reaction grace
          newPlayer.gameOver = true
          set({ moving: false })
      }

      // --- AI contestants ---
      for (const c of newContestants) {
        if (c.y <= 20) {
          c.y = 20
          c.winner = true
        }
        if (!c.winner && !c.gameOver) {
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

    const switchLight = () => {
      const { gameStarted } = get()
      if (!gameStarted) return
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

      setGameStarted: (value: boolean) => {
        cancelAnimationFrame(animationRef ?? 0)
        if (timerId) clearInterval(timerId)
        if (lightTimer) clearTimeout(lightTimer)

        if (value) {
          const newPlayer = generatePlayer()
          const newContestants = generateContestants()
          set({
            gameStarted: true,
            phase: 'running',
            timeLeft: 60,
            greenLight: false,
            gameOver: false,
            allFinished: false,
            player: newPlayer,
            contestants: newContestants,
          })

          lastFrameTime = performance.now()
          animationRef = requestAnimationFrame(render)
          switchLight()

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
        } else {
          set({ gameStarted: false, phase: 'idle' })
        }
      },

      resetGame: () => {
        cancelAnimationFrame(animationRef ?? 0)
        if (timerId) clearInterval(timerId)
        if (lightTimer) clearTimeout(lightTimer)
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

      onMoveStart: () => {
        const { greenLight, player, gameStarted } = get()
        if (!gameStarted) return
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

      onMoveStop: () => {
        set({ moving: false })
      },
    }
  })
)
