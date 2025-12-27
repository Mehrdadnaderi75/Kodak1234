
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProgress, GameType } from '../types';
import KidButton from '../components/KidButton';

interface HomeProps {
  progress: UserProgress;
}

const Home: React.FC<HomeProps> = ({ progress }) => {
  const navigate = useNavigate();

  const games: { type: GameType; label: string; icon: string; color: any }[] = [
    { type: 'counting', label: 'Counting', icon: '🔢', color: 'blue' },
    { type: 'addition', label: 'Addition', icon: '➕', color: 'green' },
    { type: 'subtraction', label: 'Subtraction', icon: '➖', color: 'pink' },
    { type: 'patterns', label: 'Patterns', icon: '🧩', color: 'yellow' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-blue-50">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-yellow-300">
            🦁
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900 leading-tight">Math Adventure!</h1>
            <p className="text-blue-600 font-semibold">Hello, Little Hero!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 px-4 py-2 rounded-2xl border-2 border-yellow-400 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-bold text-yellow-700">{progress.stars}</span>
          </div>
          <button 
            onClick={() => navigate('/parent')}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md border-2 border-gray-200 hover:bg-gray-50"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 mb-10 shadow-xl border-4 border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="text-9xl">🎈</span>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-9xl bounce-in">🦁</div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-blue-800 mb-4">Ready to Play?</h2>
            <p className="text-xl text-gray-600 mb-6">Pick a game and win some shiny stars!</p>
            <KidButton 
              size="lg" 
              color="green" 
              onClick={() => navigate('/game/counting')}
            >
              START GAME!
            </KidButton>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {games.map((game) => (
          <div 
            key={game.type}
            onClick={() => navigate(`/game/${game.type}`)}
            className="group cursor-pointer bg-white p-6 rounded-[2.5rem] border-4 border-transparent hover:border-blue-400 transition-all shadow-lg flex items-center gap-6"
          >
            <div className="text-6xl group-hover:scale-110 transition-transform">{game.icon}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{game.label}</h3>
              <p className="text-gray-500 font-semibold">Level Up & Win Stars</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500">
              ➜
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <div className="w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span>🏆</span> Your Badges
          </h3>
          <div className="flex flex-wrap gap-4">
            {progress.badges.map(badge => (
              <div key={badge} className="bg-white px-4 py-2 rounded-full border-2 border-yellow-300 shadow-sm flex items-center gap-2">
                <span className="text-xl">🏅</span>
                <span className="font-bold text-blue-800">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
