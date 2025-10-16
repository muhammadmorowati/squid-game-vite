import { useGameStore } from '../hooks/UseGameStore';

const Winner = () => {
  const {resetGame} = useGameStore();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white z-50">
      <h1 className="text-5xl font-bold mb-6 animate-bounce">🎉 You Win! 🎉</h1>
      <p className="text-xl mb-8">Congratulations, you finished the game!</p>
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-fuchsia-800 font-semibold transition-colors duration-200"
      >
        Play Again
      </button>
    </div>
  );
};

export default Winner
