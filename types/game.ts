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
