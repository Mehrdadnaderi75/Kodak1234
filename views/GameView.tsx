
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameType, Question } from '../types';
import KidButton from '../components/KidButton';

interface GameViewProps {
  onComplete: (stars: number, correct: number, total: number) => void;
}

const EMOJIS = ['🍎', '🚗', '🐶', '🍕', '⭐️', '🍦', '⚽️', '🐱', '🦄', '🎈'];

const GameView: React.FC<GameViewProps> = ({ onComplete }) => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const generateQuestions = useCallback(() => {
    const q: Question[] = [];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    for (let i = 0; i < 5; i++) {
      let prompt = "";
      let answer: number | string = 0;
      let options: (number | string)[] = [];
      let visuals: string[] = [];

      if (type === 'counting') {
        const count = Math.floor(Math.random() * 10) + 1;
        prompt = `How many ${emoji} can you see?`;
        visuals = Array(count).fill(emoji);
        answer = count;
        options = [count, count + 1, count - 1, Math.max(1, count - 2)].sort(() => Math.random() - 0.5);
      } else if (type === 'addition') {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        prompt = `${a} + ${b} = ?`;
        visuals = [...Array(a).fill(emoji), '+', ...Array(b).fill(emoji)];
        answer = a + b;
        options = [answer, answer + 1, answer - 1, Math.max(1, answer - 2)].sort(() => Math.random() - 0.5);
      } else if (type === 'subtraction') {
        const a = Math.floor(Math.random() * 6) + 4;
        const b = Math.floor(Math.random() * 4) + 1;
        prompt = `${a} - ${b} = ?`;
        visuals = Array(a).fill(emoji); // We'll visually "strike out" later or just show first count
        answer = a - b;
        options = [answer, answer + 1, answer - 1, Math.max(1, answer - 2)].sort(() => Math.random() - 0.5);
      } else if (type === 'patterns') {
        const pEmoji1 = EMOJIS[0];
        const pEmoji2 = EMOJIS[1];
        prompt = "What comes next in the pattern?";
        visuals = [pEmoji1, pEmoji2, pEmoji1, pEmoji2, pEmoji1];
        answer = pEmoji2;
        options = [pEmoji1, pEmoji2, '❓', '📦'].sort(() => Math.random() - 0.5);
      }

      q.push({
        id: `q-${i}`,
        type: type as GameType,
        prompt,
        visuals,
        options: Array.from(new Set(options)),
        answer
      });
    }
    setQuestions(q);
  }, [type]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const handleAnswer = (choice: number | string) => {
    if (showFeedback) return;

    if (choice === questions[currentIndex].answer) {
      setScore(s => s + 1);
      setShowFeedback('correct');
    } else {
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-green-50 text-center">
        <div className="text-9xl mb-6">🎉</div>
        <h2 className="text-5xl font-bold text-green-900 mb-4">Great Job!</h2>
        <p className="text-2xl text-green-700 mb-8">You answered {score} out of 5 correctly!</p>
        
        <div className="flex gap-4 mb-10">
          {[...Array(score)].map((_, i) => (
            <span key={i} className="text-6xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
          ))}
        </div>

        <div className="flex gap-4">
          <KidButton color="blue" onClick={() => {
            onComplete(score, score, questions.length);
            navigate('/');
          }}>
            BACK HOME
          </KidButton>
          <KidButton color="green" onClick={() => {
            onComplete(score, score, questions.length);
            setCurrentIndex(0);
            setScore(0);
            setIsFinished(false);
            generateQuestions();
          }}>
            PLAY AGAIN
          </KidButton>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className={`flex-1 flex flex-col items-center p-6 transition-colors duration-500 ${
      showFeedback === 'correct' ? 'bg-green-100' : 
      showFeedback === 'wrong' ? 'bg-red-100' : 'bg-blue-50'
    }`}>
      {/* HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <KidButton color="red" size="sm" onClick={() => navigate('/')}>
          QUIT
        </KidButton>
        <div className="flex items-center gap-2">
          <div className="w-48 h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <div 
              className="h-full bg-blue-400 transition-all duration-300" 
              style={{ width: `${(currentIndex / questions.length) * 100}%` }}
            />
          </div>
          <span className="font-bold text-blue-900">{currentIndex + 1} / 5</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-1 rounded-full border border-yellow-300">
          <span>⭐</span>
          <span className="font-bold">{score}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {showFeedback === 'correct' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="text-9xl animate-ping">🌟</div>
          </div>
        )}
        
        <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">{currentQ.prompt}</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {currentQ.visuals?.map((item, idx) => (
            <span key={idx} className={`text-6xl ${item === '+' || item === '-' ? 'text-blue-300 mx-4 font-bold' : ''}`}>
              {item}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
          {currentQ.options.map((option, idx) => (
            <KidButton
              key={idx}
              color={idx === 0 ? 'blue' : idx === 1 ? 'green' : idx === 2 ? 'pink' : 'yellow'}
              size="md"
              onClick={() => handleAnswer(option)}
              disabled={!!showFeedback}
            >
              {option}
            </KidButton>
          ))}
        </div>
      </div>

      {/* Floating Elements for Vibe */}
      <div className="fixed bottom-0 left-0 p-8 opacity-20 pointer-events-none text-8xl">🌈</div>
      <div className="fixed bottom-0 right-0 p-8 opacity-20 pointer-events-none text-8xl">🍦</div>
    </div>
  );
};

export default GameView;
