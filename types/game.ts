export interface Player {
  id: string;
  name: string;
  letters: string[];
}

export interface TrickAttempt {
  trickId: number;
  success: boolean;
  playerName: string;
  roundNumber: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentTrickId: number;
  usedTrickIds: number[]; // Track which tricks have been used in the game
  roundNumber: number; // Track the current round number
  allPlayersAttempted: boolean; // Track if all players have attempted the current trick
  trickHistory: TrickAttempt[]; // Track history of trick attempts
}

// New interfaces for game history
export interface GameHistoryPlayer {
  id: string;
  name: string;
  finalLetters: string[];
  isWinner: boolean; // true for the winner, false for eliminated players
}

export interface GameHistoryTrick {
  trickId: number;
  trickName: string;
  roundNumber: number;
  attempts: {
    playerName: string;
    success: boolean;
  }[];
}

export interface GameHistoryItem {
  id: string; // unique identifier for the game (timestamp-based)
  date: string; // ISO date string
  duration: number; // game duration in seconds
  players: GameHistoryPlayer[];
  tricks: GameHistoryTrick[];
  settings: {
    maxDifficulty: number;
    selectedCategories: string[];
    difficultyPreference: 'easy' | 'medium' | 'hard';
  };
  summary: string; // e.g., "John won against 3 players" or "All players eliminated"
}

export type GameHistoryList = GameHistoryItem[];
