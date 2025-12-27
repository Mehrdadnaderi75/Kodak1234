
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProgress } from '../types';
import KidButton from '../components/KidButton';

interface ParentPanelProps {
  progress: UserProgress;
  onReset: () => void;
}

const ParentPanel: React.FC<ParentPanelProps> = ({ progress, onReset }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Parent / Teacher Panel</h2>
          <button onClick={() => navigate('/')} className="text-4xl">✖️</button>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
            <span className="font-semibold text-gray-600">Total Stars Earned</span>
            <span className="text-2xl font-bold text-blue-600">{progress.stars} ⭐</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
            <span className="font-semibold text-gray-600">Games Completed</span>
            <span className="text-2xl font-bold text-green-600">{progress.completedLevels}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-pink-50 rounded-xl">
            <span className="font-semibold text-gray-600">Accuracy Rate</span>
            <span className="text-2xl font-bold text-pink-600">{progress.accuracy}%</span>
          </div>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
          <p className="text-gray-500 mb-6">Resetting will delete all stars, badges, and progress permanently.</p>
          <KidButton 
            color="red" 
            size="sm" 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete all progress? This cannot be undone!")) {
                onReset();
                navigate('/');
              }
            }}
          >
            RESET ALL DATA
          </KidButton>
        </div>
      </div>
      
      <div className="mt-10 text-center text-gray-400 max-w-md">
        <p>Built for GitHub Pages. No backend required. All data is stored locally in your browser.</p>
      </div>
    </div>
  );
};

export default ParentPanel;
