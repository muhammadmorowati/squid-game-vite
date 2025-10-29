// Game.tsx
import { useState, useEffect } from "react";
import Contestant from "./Contestant";
import DollMusic from "./DollMusic";
import Finish from "./Finish";
import HomePage from "./HomePage";
import PlayerButton from "./PlayerButton";
import Timer from "./Timer";
import { useGameStore } from "../hooks/UseGameStore";

const Game = () => {
  const { player, contestants, gameStarted, phase } = useGameStore();
  const [countdown, setCountdown] = useState(3);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // 🧩 Preload all assets before starting the game
  useEffect(() => {
    const images = [
      "doll.png",
      "player.png",
      "kill-blood.png",
      "squid-game-start.jpg",
    ];
    const sounds = [
      "sounds/green-light.mp3",
      "sounds/MLG sniper sound effect.mp3",
    ];

    let loaded = 0;
    const total = images.length + sounds.length;

    // Load images
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === total) setAssetsLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === total) setAssetsLoaded(true);
      };
    });

    // Load sounds
    sounds.forEach((src) => {
      const audio = new Audio();
      audio.src = src;
      audio.load();
      audio.oncanplaythrough = () => {
        loaded++;
        if (loaded === total) setAssetsLoaded(true);
      };
      audio.onerror = () => {
        loaded++;
        if (loaded === total) setAssetsLoaded(true);
      };
    });
  }, []);

  // 🔢 Countdown when phase === "countdown"
  useEffect(() => {
    if (phase === "countdown") {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // 🧠 Show loading screen while preloading assets
  if (!assetsLoaded) {
    return (
      <div className="bg-black text-white flex items-center justify-center h-screen text-3xl">
        Loading assets...
      </div>
    );
  }

  // 🏠 Show Home Page before game starts
  if (!gameStarted || phase === "idle") {
    return <HomePage />;
  }

  return (
    <div className="bg-orange-300 h-screen w-screen absolute overflow-hidden">
      {phase === "running" && <Timer />}

      {phase === "countdown" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <h1 className="text-white text-[clamp(50px,10vw,120px)] font-bold">
            {countdown > 0 ? countdown : "Go!"}
          </h1>
        </div>
      )}

      <PlayerButton />
      <Finish />

      <img
        className="absolute left-1/2 -translate-x-1/2 z-40 max-sm:left-1/3"
        src="doll.png"
        alt="doll"
        width={150}
        height={150}
      />

      <Contestant
        x={player.x}
        y={player.y}
        name={player.name}
        gameOver={player.gameOver}
      />

      {contestants.map((c) => (
        <Contestant
          key={c.name}
          x={c.x}
          y={c.y}
          name={c.name}
          gameOver={c.gameOver}
        />
      ))}

      <DollMusic />
    </div>
  );
};

export default Game;
