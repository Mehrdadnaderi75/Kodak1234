
export type GameType = 'counting' | 'addition' | 'subtraction' | 'patterns';

export interface UserProgress {
  stars: number;
  completedLevels: number;
  accuracy: number;
  badges: string[];
}

export interface Question {
  id: string;
  type: GameType;
  prompt: string;
  visuals?: string[];
  options: (number | string)[];
  answer: number | string;
}

export interface GameState {
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
}
