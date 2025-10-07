import { Howl } from 'howler'
import { useEffect, useRef } from 'react'

type GameAudioProps = {
  greenLight: boolean
}

 const GameAudio = ({ greenLight }: GameAudioProps) => {
  const greenLightSound = useRef<Howl | null>(null)

  useEffect(() => {
    if (!greenLightSound.current) {
      greenLightSound.current = new Howl({
        src: ['/sounds/green-light.mp3'], // Replace with actual file path
        volume: 0.5,
        loop: false, // Prevent looping, so it cuts off when red light happens
        rate: 1, // Default speed
      })
    }

    if (greenLight) {
      // Random speed between 1x and 2x
      const randomSpeed = 1 + Math.random()
      greenLightSound.current.rate(randomSpeed)
      
      greenLightSound.current.play()
    } else {
      greenLightSound.current.stop() // Stop completely on red light
    }

    return () => {
      greenLightSound.current?.stop() // Ensure it stops when unmounting
    }
  }, [greenLight])

  return null
}

export default GameAudio