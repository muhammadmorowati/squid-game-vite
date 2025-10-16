import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useGameStore } from '../hooks/UseGameStore'

const DollMusic = () => {
  const { greenLight, greenLightCounter,timeLeft } = useGameStore()
  const greenLightSound = useRef<Howl | null>(null)

  useEffect(() => {
    // Create the sound once
    if (!greenLightSound.current) {
      greenLightSound.current = new Howl({
        src: ['/sounds/green-light.mp3'],
        volume: 0.7,
        loop: false,
      })
    }

    const sound = greenLightSound.current

    // ✅ Stop music if time is up
    if (timeLeft == 0) {
      sound.stop()
      return
    }

    if (greenLight) {
      // Convert counter (~60fps) → milliseconds
      const greenLightDuration = greenLightCounter * (1000 / 60)

      // The full length of your sound in ms (4.7 seconds)
      const baseAudioDuration = 4700

      // Calculate playback rate to perfectly sync the full song
      const rate = baseAudioDuration / greenLightDuration

      // Clamp the rate to avoid audio distortion
      const clampedRate = Math.min(Math.max(rate, 0.5), 3)

      // Restart and play at calculated rate
      sound.stop()
      sound.rate(clampedRate)
      sound.play()
    } else {
      sound.stop()
    }

    return () => {
      sound.stop()
    }
  }, [greenLight, greenLightCounter])

  return null
}

export default DollMusic
