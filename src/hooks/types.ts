export type ContestantType = {
  x: number
  y: number
  name: string
  gameOver: boolean
  speed: number
  winner: boolean
}

export type Phase = 'idle' | 'countdown' | 'running' | 'finished'

export type GameState = {
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