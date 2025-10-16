import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useGameStore } from '../hooks/UseGameStore'


const DollMusic = () => {

   const { greenLight, greenLightCounter } = useGameStore()
   const greenLightSound = useRef<Howl | null>(null)

  useEffect(() => {
    if (!greenLightSound.current) {
      greenLightSound.current = new Howl({
        src: ['/sounds/green-light.mp3'],
        volume: 0.5,
        loop: false,
        rate: 1, // Default speed
      })
    }

    if (greenLight) {
      // Set playback speed based on green light duration (shorter = faster)
      const minDuration = 100 // Minimum duration
      const maxDuration = 200 // Maximum duration
      const speed = 1 + (1 * (1 - (greenLightCounter - minDuration) / (maxDuration - minDuration)))

      greenLightSound.current.rate(speed)
      greenLightSound.current.play()
    } else {
      // Stop on red light
      greenLightSound.current.stop() 
    }

    return () => {
      greenLightSound.current?.stop()
    }
  }, [greenLight, greenLightCounter])

  return null
}

export default DollMusic