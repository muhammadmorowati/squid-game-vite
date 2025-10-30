import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useGameStore } from "../hooks/UseGameStore";

const DollMusic = () => {
  const { greenLight, greenLightCounter, timeLeft,allFinished } = useGameStore();
  const greenLightSound = useRef<Howl | null>(null);

  // 🎵 Preload sound on mount
  useEffect(() => {
    greenLightSound.current = new Howl({
      src: ["sounds/green-light.mp3"],
      volume: 0.7,
      preload: true,
    });
  }, []);

  useEffect(() => {
  const sound = greenLightSound.current;
  if (!sound) return; // اگر هنوز ساخته نشده، کاری نکن

  // وقتی تایمر تموم میشه صدا رو قطع کن
  if (timeLeft === 0 || allFinished) {
    sound.stop();
    return;
  }

  if (greenLight) {
    const greenLightDuration = greenLightCounter * (1000 / 60);
    const baseAudioDuration = 4700;
    const rate = baseAudioDuration / greenLightDuration;
    const clampedRate = Math.min(Math.max(rate, 0.5), 3);

    sound.stop();
    sound.rate(clampedRate);
    sound.play();
  } else {
    sound.stop();
  }

  // ✅ تابع cleanup همیشه یا void یا تابع معتبر برمی‌گردونه
  return () => {
    if (sound) sound.stop();
  };
}, [greenLight, greenLightCounter]);

  return null;
};

export default DollMusic;
