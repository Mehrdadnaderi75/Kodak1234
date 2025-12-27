
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import GameView from './views/GameView';
import ParentPanel from './views/ParentPanel';
import { UserProgress } from './types';

const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('math_quest_progress');
    return saved ? JSON.parse(saved) : {
      stars: 0,
      completedLevels: 0,
      accuracy: 0,
      badges: []
    };
  });

  useEffect(() => {
    localStorage.setItem('math_quest_progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (newStars: number, correctAnswers: number, totalQuestions: number) => {
    setProgress(prev => {
      const totalAttempted = (prev.completedLevels * 5) + totalQuestions; // assuming 5 q per level roughly
      const totalCorrect = Math.round((prev.accuracy / 100) * (prev.completedLevels * 5)) + correctAnswers;
      const newAccuracy = Math.min(100, Math.round((totalCorrect / totalAttempted) * 100));
      
      const newBadges = [...prev.badges];
      if (prev.completedLevels === 0 && newStars > 0) newBadges.push('First Step');
      if (prev.stars + newStars >= 10 && !newBadges.includes('Star Collector')) newBadges.push('Star Collector');
      if (newAccuracy >= 90 && prev.completedLevels > 5 && !newBadges.includes('Math Wiz')) newBadges.push('Math Wiz');

      return {
        stars: prev.stars + newStars,
        completedLevels: prev.completedLevels + 1,
        accuracy: newAccuracy,
        badges: Array.from(new Set(newBadges))
      };
    });
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home progress={progress} />} />
          <Route path="/game/:type" element={<GameView onComplete={updateProgress} />} />
          <Route path="/parent" element={<ParentPanel progress={progress} onReset={() => setProgress({ stars: 0, completedLevels: 0, accuracy: 0, badges: [] })} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
