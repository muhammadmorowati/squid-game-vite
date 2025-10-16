import { Howl } from 'howler'
import { useEffect, useRef } from 'react'
import { useGameStore } from '../hooks/UseGameStore'


const GameAudio = () => {

   const { greenLight } = useGameStore()
  const greenLightSound = useRef<Howl | null>(null)

  useEffect(() => {
    if (!greenLightSound.current) {
      greenLightSound.current = new Howl({
        src: ['/sounds/green-light.mp3'],
        volume: 0.5,
        // Prevent looping, so it cuts off when red light happens
        loop: false, 
        rate: 1, // Default speed
      })
    }

    if (greenLight) {
      // Random speed between 1x and 2x
      const randomSpeed = 1 + Math.random()
      greenLightSound.current.rate(randomSpeed)
      
      greenLightSound.current.play()
    } else {
       // Stop completely on red light
      greenLightSound.current.stop()
    }

    return () => {
      // Ensure it stops when unmounting
      greenLightSound.current?.stop() 
    }
  }, [greenLight])

  return null
}

export default GameAudio