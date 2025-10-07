import { useEffect, useRef } from 'react'
import { Howl } from 'howler';

type DollMusicProps = {
  greenLight: boolean
  greenLightDuration: number
}

 const DollMusic = ({ greenLight, greenLightDuration }: DollMusicProps) => {
  const greenLightSound = useRef<Howl | null>(null)

  useEffect(() => {
    if (!greenLightSound.current) {
      greenLightSound.current = new Howl({
        src: ['/sounds/green-light.mp3'], // Replace with actual file path
        volume: 0.5,
        loop: false,
        rate: 1, // Default speed
      })
    }

    if (greenLight) {
      // Set playback speed based on green light duration (shorter = faster)
      const minDuration = 100 // Minimum duration
      const maxDuration = 200 // Maximum duration
      const speed = 1 + (1 * (1 - (greenLightDuration - minDuration) / (maxDuration - minDuration)))

      greenLightSound.current.rate(speed)
      greenLightSound.current.play()
    } else {
      greenLightSound.current.stop() // Stop on red light
    }

    return () => {
      greenLightSound.current?.stop()
    }
  }, [greenLight, greenLightDuration])

  return null
}

export default DollMusic